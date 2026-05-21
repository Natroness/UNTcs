import type {
  Catalog,
  ChoiceGroupStatus,
  ElectiveStatus,
} from "@/types/course";

/**
 * Evaluate every choice group in the catalog against the student's completed
 * (normalized) course codes. A choice group is satisfied once the student has
 * completed at least `requiredCount` of the listed options.
 */
export function checkChoiceGroups(
  catalog: Catalog,
  completedCodes: string[],
): ChoiceGroupStatus[] {
  const completedSet = new Set(completedCodes);

  return catalog.choiceGroups.map((group) => {
    const completed = group.courseCodes.filter((code) => completedSet.has(code));
    const remaining = group.courseCodes.filter((code) => !completedSet.has(code));
    return {
      id: group.id,
      title: group.title,
      requiredCount: group.requiredCount,
      completedCount: completed.length,
      satisfied: completed.length >= group.requiredCount,
      completedCourses: completed,
      remainingOptions: remaining,
    };
  });
}

/**
 * Evaluate every elective requirement against the student's completed
 * (normalized) course codes. Counts credit hours of eligible courses the
 * student has finished. Caps applied credits at the requirement's threshold so
 * a single course doesn't inflate progress reporting.
 */
export function checkElectives(
  catalog: Catalog,
  completedCodes: string[],
): ElectiveStatus[] {
  const completedSet = new Set(completedCodes);
  const creditsByCode = new Map(catalog.courses.map((c) => [c.code, c.credits]));

  return catalog.electives.map((req) => {
    const applied = req.eligibleCourseCodes.filter((code) => completedSet.has(code));
    const earned = applied.reduce((sum, code) => sum + (creditsByCode.get(code) ?? 0), 0);
    return {
      id: req.id,
      title: req.title,
      requiredCredits: req.requiredCredits,
      earnedCredits: earned,
      satisfied: earned >= req.requiredCredits,
      appliedCourses: applied,
    };
  });
}
