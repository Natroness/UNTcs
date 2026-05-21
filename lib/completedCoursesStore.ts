import type { CompletedCourse } from "@/types/course";

/**
 * Client-side handoff between the transfer-audit page, the dashboard, and the
 * DAG page. No database / no auth in this MVP: we just persist the latest
 * known completed-course set in localStorage so that:
 *   - The dashboard can pre-fill from a parsed UNT audit.
 *   - The DAG page can color completed nodes light green.
 *
 * All functions are safe to call during SSR (they no-op when window is
 * undefined).
 */
const KEY_COMPLETED = "unt-tracker:completedCourses";
const KEY_DETAILED = "unt-tracker:completedDetailed";

export function saveCompletedCodes(codes: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY_COMPLETED, JSON.stringify(codes));
  } catch {
    // ignore quota / privacy mode errors
  }
}

export function loadCompletedCodes(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY_COMPLETED);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed) && parsed.every((v) => typeof v === "string")) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

export function saveCompletedDetailed(items: CompletedCourse[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY_DETAILED, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function loadCompletedDetailed(): CompletedCourse[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY_DETAILED);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (
      Array.isArray(parsed) &&
      parsed.every(
        (v): v is CompletedCourse =>
          !!v &&
          typeof v === "object" &&
          typeof (v as CompletedCourse).untEquivalentCode === "string" &&
          typeof (v as CompletedCourse).source === "string",
      )
    ) {
      return parsed as CompletedCourse[];
    }
    return [];
  } catch {
    return [];
  }
}

export function clearCompleted(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY_COMPLETED);
    window.localStorage.removeItem(KEY_DETAILED);
  } catch {
    // ignore
  }
}
