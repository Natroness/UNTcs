import type { Catalog, Course } from "@/types/course";

export interface RequirementBreakdown {
  completedRequired: string[];
  remainingRequired: string[];
  unknown: string[];
}

/**
 * Compare a set of completed (already-normalized) course codes against the
 * catalog and split them into completed required, remaining required, and
 * unknown (not in the catalog) buckets.
 *
 * Only courses with type === "required" are considered for completion vs.
 * remaining accounting. Choice groups and electives are handled separately by
 * electiveChecker.
 */
export function checkRequirements(
  catalog: Catalog,
  completedCodes: string[],
): RequirementBreakdown {
  const completedSet = new Set(completedCodes);
  const catalogCodes = new Set(catalog.courses.map((c) => c.code));

  const requiredCourses: Course[] = catalog.courses.filter((c) => c.type === "required");

  const completedRequired: string[] = [];
  const remainingRequired: string[] = [];

  for (const course of requiredCourses) {
    if (completedSet.has(course.code)) {
      completedRequired.push(course.code);
    } else {
      remainingRequired.push(course.code);
    }
  }

  const unknown = completedCodes.filter((code) => !catalogCodes.has(code));

  return {
    completedRequired: completedRequired.sort(),
    remainingRequired: remainingRequired.sort(),
    unknown: unknown.sort(),
  };
}

export function computeProgress(breakdown: RequirementBreakdown) {
  const total = breakdown.completedRequired.length + breakdown.remainingRequired.length;
  const completed = breakdown.completedRequired.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completedRequired: completed, totalRequired: total, percent };
}
