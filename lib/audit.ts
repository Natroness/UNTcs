import type { AuditResult, Catalog } from "@/types/course";
import { normalizeCourseCodes } from "./normalizeCourseCode";
import { checkRequirements, computeProgress } from "./requirementChecker";
import { checkPrerequisites } from "./prerequisiteChecker";
import { checkChoiceGroups, checkElectives } from "./electiveChecker";

/**
 * One-shot audit: normalize input, then run requirement, prerequisite, choice,
 * and elective checks against the catalog. Returns a fully-shaped AuditResult
 * regardless of whether the input was empty.
 */
export function runAudit(catalog: Catalog, completedCoursesRaw: string[]): AuditResult {
  const normalized = normalizeCourseCodes(completedCoursesRaw);

  const reqs = checkRequirements(catalog, normalized);
  const prereqs = checkPrerequisites(catalog, normalized);
  const choices = checkChoiceGroups(catalog, normalized);
  const electives = checkElectives(catalog, normalized);
  const progress = computeProgress(reqs);

  return {
    normalized,
    unknown: reqs.unknown,
    completedRequired: reqs.completedRequired,
    remainingRequired: reqs.remainingRequired,
    available: prereqs.available,
    locked: prereqs.locked,
    choiceGroups: choices,
    electives,
    progress,
  };
}
