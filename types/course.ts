export type CourseType = "required" | "choice" | "elective";

/** Visual status of a course in the prerequisite DAG. */
export type CourseStatus = "completed" | "available" | "locked";

/** Data payload carried by each custom CourseNode in React Flow. */
export interface CourseNodeData {
  code: string;
  title: string;
  credits: number;
  courseType: CourseType;
  status: CourseStatus;
  /** True when this completed course was fulfilled via a transfer equivalent. */
  isTransfer?: boolean;
}

export interface Course {
  code: string;
  title: string;
  credits: number;
  type: CourseType;
  prerequisites: string[];
  corequisites: string[];
  choiceGroup?: string;
  description?: string;
}

export interface ChoiceGroup {
  id: string;
  title: string;
  requiredCount: number;
  courseCodes: string[];
}

export interface ElectiveRequirement {
  id: string;
  title: string;
  requiredCredits: number;
  eligibleCourseCodes: string[];
  description?: string;
}

export interface CatalogMeta {
  program: string;
  catalogYear: string;
  notes?: string;
}

export interface Catalog {
  meta: CatalogMeta;
  courses: Course[];
  choiceGroups: ChoiceGroup[];
  electives: ElectiveRequirement[];
}

export interface LockedCourse {
  code: string;
  missingPrerequisites: string[];
}

export interface ChoiceGroupStatus {
  id: string;
  title: string;
  requiredCount: number;
  completedCount: number;
  satisfied: boolean;
  completedCourses: string[];
  remainingOptions: string[];
}

export interface ElectiveStatus {
  id: string;
  title: string;
  requiredCredits: number;
  earnedCredits: number;
  satisfied: boolean;
  appliedCourses: string[];
}

export interface AuditResult {
  normalized: string[];
  unknown: string[];
  completedRequired: string[];
  remainingRequired: string[];
  available: string[];
  locked: LockedCourse[];
  choiceGroups: ChoiceGroupStatus[];
  electives: ElectiveStatus[];
  progress: {
    completedRequired: number;
    totalRequired: number;
    percent: number;
  };
}

/**
 * Source of a completed-course entry. UNT means the student took the UNT
 * course directly; TRANSFER means a non-UNT course was accepted as the UNT
 * equivalent (per the official UNT degree audit); MANUAL means the student
 * entered the code by hand on the dashboard.
 */
export type CompletedCourseSource = "UNT" | "TRANSFER" | "MANUAL";

export interface CompletedCourse {
  untEquivalentCode: string;
  originalTransferCode?: string;
  source: CompletedCourseSource;
}

export interface UntAuditParseResult {
  completedCourses: string[];
  remainingCourses: string[];
  completed: CompletedCourse[];
}

export interface TransferAuditApiResult extends UntAuditParseResult {
  matchedCatalogCourses: string[];
  unknownCourses: string[];
  summary: {
    completedCount: number;
    remainingCount: number;
    matchedCount: number;
    unknownCount: number;
    transferCount: number;
  };
}
