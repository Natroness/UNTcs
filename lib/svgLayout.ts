/**
 * lib/svgLayout.ts
 *
 * Thin adapter over the auto-generated position map.
 * This file intentionally contains NO hardcoded coordinates — all positions
 * come from lib/generatedCoursePositions.ts which is produced by:
 *   npm run extract:course-map
 *
 * No React or React Flow imports allowed here.
 */

import {
  GENERATED_COURSE_POSITIONS,
  type CoursePosition,
} from "./generatedCoursePositions";

export type { CoursePosition };

/**
 * Returns the ReactFlow top-left position for a course extracted from the
 * handmade Excalidraw SVG, or null if the course was not found in the SVG.
 */
export function getSvgCoursePosition(courseCode: string): CoursePosition | null {
  return GENERATED_COURSE_POSITIONS[courseCode] ?? null;
}

/** Returns true when a handmade SVG position exists for the given course code. */
export function hasSvgPosition(courseCode: string): boolean {
  return Boolean(GENERATED_COURSE_POSITIONS[courseCode]);
}

/** How many courses have SVG positions (useful for diagnostics). */
export function svgPositionCount(): number {
  return Object.keys(GENERATED_COURSE_POSITIONS).length;
}
