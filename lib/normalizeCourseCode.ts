/**
 * Normalize a raw course code string into the canonical "DEPT 1234" form.
 *
 * Accepts forms like:
 *   csce1030, CSCE-1030, csce 1030, csce_1030, CSCE   1030, csce.1030
 * Returns:
 *   "CSCE 1030"
 *
 * Returns null when the input does not look like a valid department + number pair.
 */
export function normalizeCourseCode(raw: string): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (trimmed.length === 0) return null;

  const cleaned = trimmed.replace(/[\-_.]/g, " ").replace(/\s+/g, " ").toUpperCase();

  const compact = cleaned.replace(/\s+/g, "");
  const match = compact.match(/^([A-Z]{2,5})(\d{3,4}[A-Z]?)$/);
  if (!match) return null;

  const [, dept, number] = match;
  return `${dept} ${number}`;
}

/**
 * Normalize a list of raw course codes, returning unique canonical codes.
 * Invalid entries are dropped silently; callers can detect them via length diff.
 */
export function normalizeCourseCodes(raw: string[]): string[] {
  const seen = new Set<string>();
  for (const item of raw) {
    const normalized = normalizeCourseCode(item);
    if (normalized) seen.add(normalized);
  }
  return Array.from(seen);
}
