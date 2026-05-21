import { normalizeCourseCode } from "./normalizeCourseCode";

/**
 * Tokens that look like "DEPT NUMBER" but are actually transcript metadata
 * (term + year, GPA labels, etc). Anything matching these prefixes is dropped
 * even if it parses as a syntactically valid course code.
 */
const TERM_PREFIX_BLACKLIST = new Set([
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

/**
 * Extract unique normalized course codes from arbitrary pasted transcript
 * text. Looks for tokens that match "DEPT NUMBER" with optional dashes or
 * spaces between the department and number. Obvious transcript noise such as
 * "FALL 2024" is filtered out via a small prefix blacklist.
 */
export function parseTranscript(text: string): string[] {
  if (typeof text !== "string" || text.trim().length === 0) return [];

  const codePattern = /\b([A-Za-z]{2,5})[\s\-_.]*?(\d{3,4}[A-Za-z]?)\b/g;
  const seen = new Set<string>();

  for (const match of text.matchAll(codePattern)) {
    const dept = match[1].toUpperCase();
    if (TERM_PREFIX_BLACKLIST.has(dept)) continue;

    const raw = `${dept} ${match[2]}`;
    const normalized = normalizeCourseCode(raw);
    if (normalized) seen.add(normalized);
  }

  return Array.from(seen).sort();
}
