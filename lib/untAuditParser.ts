import { normalizeCourseCode } from "./normalizeCourseCode";
import type {
  CompletedCourse,
  CompletedCourseSource,
  UntAuditParseResult,
} from "@/types/course";

/**
 * Matches a course-code-like token: 2-5 letter department, optional space or
 * dash, then 4 digits (with an optional trailing letter for honors/lab
 * variants). The regex deliberately uses i-flag so we can scan transcripts and
 * audits regardless of case.
 */
const COURSE_CODE_PATTERN = /\b[A-Za-z]{2,5}\s?-?\s?\d{4}[A-Za-z]?\b/g;

/**
 * Signals that mark a line's referenced course(s) as completed. We require
 * word boundaries so that e.g. "INCOMPLETE" never matches "COMPLETE", and
 * "NOT SATISFIED" never matches "SATISFIED". TR is intentionally narrow.
 */
const COMPLETE_SIGNAL = /\b(COMPLETED?|SATISFIED|TAKEN|TRANSFER|TR)\b/;

/**
 * Signals that mark the line's referenced course(s) as still needed. Checked
 * BEFORE complete signals so a line containing both ("STILL NEEDED: SATISFIED
 * BY ...") biases toward the safer outcome of leaving the course unmarked.
 */
const INCOMPLETE_SIGNAL = /(INCOMPLETE|NOT\s+SATISFIED|STILL\s+NEEDED|\bNEEDED\b)/;

/**
 * Tokens that look syntactically like course codes but are transcript or
 * audit metadata. Dropped to avoid false positives.
 */
const NON_COURSE_PREFIXES = new Set([
  "FALL",
  "SPRG",
  "SPR",
  "SPRING",
  "SUM",
  "SUMR",
  "SUMMER",
  "WIN",
  "WINTR",
  "WINTER",
  "FA",
  "SP",
  "SU",
  "WI",
  "GPA",
  "QPA",
  "ID",
  "SSN",
  "SID",
]);

type LineStatus = "complete" | "incomplete" | "none";

function detectStatus(line: string): LineStatus {
  const upper = line.toUpperCase();
  if (INCOMPLETE_SIGNAL.test(upper)) return "incomplete";
  if (COMPLETE_SIGNAL.test(upper)) return "complete";
  return "none";
}

/**
 * Extract every course-code-like token from a single line and return their
 * canonical, normalized forms (deduped). Metadata tokens like "FALL 2024" are
 * filtered out.
 */
function extractCodesFromLine(line: string): string[] {
  const codes = new Set<string>();
  for (const match of line.matchAll(COURSE_CODE_PATTERN)) {
    const raw = match[0];
    const deptMatch = raw.match(/[A-Za-z]{2,5}/);
    if (!deptMatch) continue;
    const dept = deptMatch[0].toUpperCase();
    if (NON_COURSE_PREFIXES.has(dept)) continue;
    const normalized = normalizeCourseCode(raw);
    if (normalized) codes.add(normalized);
  }
  return [...codes];
}

/**
 * Catalog departments owned by UNT for the tracked program. Used as a hint to
 * decide which code on a transfer line is the UNT equivalent vs. the original
 * institution's code (e.g. "CSCE 1030 = HCC COSC 1336 TR").
 */
const UNT_CATALOG_DEPTS = new Set(["CSCE", "MATH", "PHYS", "ENGL", "TECM"]);

function pickUntEquivalent(codes: string[]): {
  untCode: string;
  originalTransferCode?: string;
} {
  if (codes.length === 0) {
    return { untCode: "" };
  }
  const untIndex = codes.findIndex((c) => UNT_CATALOG_DEPTS.has(c.split(" ")[0]));
  if (untIndex === -1) {
    return { untCode: codes[0] };
  }
  const untCode = codes[untIndex];
  const other = codes.find((c, i) => i !== untIndex);
  return { untCode, originalTransferCode: other };
}

/**
 * Parse pasted UNT degree audit text.
 *
 * The parser is intentionally conservative for transfer students:
 *  - A course is added to completedCourses only when its line includes an
 *    explicit completion signal (COMPLETE, SATISFIED, TAKEN, TRANSFER, TR).
 *  - A course is added to remainingCourses when its line includes a needed
 *    signal (INCOMPLETE, NOT SATISFIED, STILL NEEDED, NEEDED).
 *  - If a line carries both signals, the course is treated as remaining (not
 *    completed) to avoid false-positive transfer credit.
 *  - All codes are normalized to canonical "DEPT 1234" form and deduped.
 *  - Empty / invalid input returns empty arrays rather than throwing.
 *
 * Returns the simple completed/remaining string arrays plus a richer
 * `completed: CompletedCourse[]` list that retains transfer provenance.
 */
export function parseUntAuditText(text: string): UntAuditParseResult {
  if (typeof text !== "string" || text.trim().length === 0) {
    return { completedCourses: [], remainingCourses: [], completed: [] };
  }

  const completedCourses = new Set<string>();
  const remainingCourses = new Set<string>();
  const completedDetailed = new Map<string, CompletedCourse>();

  const lines = text.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.length === 0) continue;

    const codes = extractCodesFromLine(line);
    if (codes.length === 0) continue;

    const status = detectStatus(line);
    if (status === "none") continue;

    if (status === "incomplete") {
      for (const code of codes) {
        if (UNT_CATALOG_DEPTS.has(code.split(" ")[0])) {
          remainingCourses.add(code);
        }
      }
      continue;
    }

    const upper = line.toUpperCase();
    const isTransferLine = /\b(TRANSFER|TR)\b/.test(upper);
    const source: CompletedCourseSource = isTransferLine ? "TRANSFER" : "UNT";
    const { untCode, originalTransferCode } = pickUntEquivalent(codes);
    if (!untCode) continue;

    completedCourses.add(untCode);
    if (!completedDetailed.has(untCode)) {
      completedDetailed.set(untCode, {
        untEquivalentCode: untCode,
        source,
        ...(originalTransferCode && originalTransferCode !== untCode
          ? { originalTransferCode }
          : {}),
      });
    }
  }

  for (const code of completedCourses) {
    remainingCourses.delete(code);
  }

  return {
    completedCourses: [...completedCourses].sort(),
    remainingCourses: [...remainingCourses].sort(),
    completed: [...completedDetailed.values()].sort((a, b) =>
      a.untEquivalentCode.localeCompare(b.untEquivalentCode),
    ),
  };
}
