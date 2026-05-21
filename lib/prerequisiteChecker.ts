import type { Catalog, LockedCourse } from "@/types/course";

export interface PrerequisiteBreakdown {
  available: string[];
  locked: LockedCourse[];
}

/**
 * Given a set of completed (normalized) course codes, return:
 *  - available: catalog courses the student has NOT completed whose hard
 *    prerequisites are all satisfied.
 *  - locked: catalog courses the student has NOT completed that are blocked by
 *    one or more missing prerequisites, including which prerequisites are
 *    missing.
 *
 * Corequisites are intentionally NOT treated as blockers: they may be taken in
 * the same term, so they don't lock a course out by themselves.
 */
export function checkPrerequisites(
  catalog: Catalog,
  completedCodes: string[],
): PrerequisiteBreakdown {
  const completedSet = new Set(completedCodes);
  const available: string[] = [];
  const locked: LockedCourse[] = [];

  for (const course of catalog.courses) {
    if (completedSet.has(course.code)) continue;

    const missing = course.prerequisites.filter((p) => !completedSet.has(p));
    if (missing.length === 0) {
      available.push(course.code);
    } else {
      locked.push({ code: course.code, missingPrerequisites: missing });
    }
  }

  available.sort();
  locked.sort((a, b) => a.code.localeCompare(b.code));

  return { available, locked };
}
