import { normalizeCourseCode } from "@/lib/normalizeCourseCode";

export interface TransferGuideEntry {
  unt: string;
  tccns: string[];
  note?: string;
}

export interface TransferGuideTerm {
  fall?: TransferGuideEntry[];
  spring?: TransferGuideEntry[];
  summer?: TransferGuideEntry[];
}

export interface TransferGuideYear extends TransferGuideTerm {
  year: number;
}

export interface TransferGuide {
  school: string;
  target: string;
  description?: string;
  years: TransferGuideYear[];
}

/** Flatten a guide into a single array of all entries across all years/terms. */
function flattenGuide(guide: TransferGuide): TransferGuideEntry[] {
  const entries: TransferGuideEntry[] = [];
  for (const yr of guide.years) {
    for (const term of ["fall", "spring", "summer"] as const) {
      for (const entry of yr[term] ?? []) {
        entries.push(entry);
      }
    }
  }
  return entries;
}

/**
 * Map a single TCCNS code (or any incoming code) to its UNT-equivalent code
 * using the provided transfer guide. Returns the UNT code string when a match
 * is found, or null when no mapping exists.
 *
 * Matching is done after normalizing both sides to "DEPT 1234" form so that
 * casing/formatting differences are ignored.
 */
export function mapTransferToUNT(
  rawCode: string,
  guide: TransferGuide,
): string | null {
  const normalized = normalizeCourseCode(rawCode);
  if (!normalized) return null;

  for (const entry of flattenGuide(guide)) {
    const tccnsNorm = entry.tccns.map((c) => normalizeCourseCode(c));
    if (tccnsNorm.includes(normalized)) {
      return entry.unt;
    }
  }
  return null;
}

/**
 * Given a list of raw completed codes (which may contain a mix of TCCNS codes,
 * UNT codes, and ambiguous inputs), return a deduplicated list of UNT-equivalent
 * codes suitable for the degree audit and DAG.
 *
 * Algorithm:
 *   1. Normalize each code to canonical "DEPT 1234" form.
 *   2. Attempt to map it via the transfer guide.
 *   3. If mapped, use the UNT equivalent; otherwise keep the normalized code.
 *   4. Deduplicate via Set.
 *
 * Example:
 *   "COSC 1436" → "CSCE 1030"   (mapped via TCC guide)
 *   "MATH 2413" → "MATH 1710"   (mapped via TCC guide)
 *   "CSCE 1030" → "CSCE 1030"   (already UNT, kept as-is)
 */
export function normalizeCompletedWithTransfers(
  rawCodes: string[],
  guide: TransferGuide,
): string[] {
  const seen = new Set<string>();
  for (const raw of rawCodes) {
    const norm = normalizeCourseCode(raw);
    if (!norm) continue;
    const mapped = mapTransferToUNT(norm, guide) ?? norm;
    seen.add(mapped);
  }
  return Array.from(seen);
}

/**
 * Returns the set of TCCNS codes that appear in the guide (normalized), so
 * callers can label DAG nodes as transfer-completed.
 */
export function buildTccnsSet(guide: TransferGuide): Set<string> {
  const s = new Set<string>();
  for (const entry of flattenGuide(guide)) {
    for (const code of entry.tccns) {
      const n = normalizeCourseCode(code);
      if (n) s.add(n);
    }
  }
  return s;
}
