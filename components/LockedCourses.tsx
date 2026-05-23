import type { LockedCourse } from "@/types/course";

interface Props {
  locked: LockedCourse[];
}

export function LockedCourses({ locked }: Props) {
  return (
    <div className="card card-pad">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-tight text-white">Locked</h3>
        <span className="chip chip-red">{locked.length} courses</span>
      </div>
      <p className="mb-4 text-sm text-[#84a5aa]">
        Blocked by unmet prerequisites. Corequisites do not lock a course.
      </p>

      {locked.length === 0 ? (
        <p className="text-sm text-[#84a5aa]">Nothing locked — every remaining course is reachable.</p>
      ) : (
        <ul className="divide-y divide-white/5">
          {locked.map((c) => (
            <li key={c.code} className="py-3 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-sm font-bold text-white">{c.code}</span>
                <span className="text-xs text-[#84a5aa]">
                  needs {c.missingPrerequisites.length} prereq{c.missingPrerequisites.length === 1 ? "" : "s"}
                </span>
              </div>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {c.missingPrerequisites.map((p) => (
                  <li key={p} className="chip chip-red font-mono">{p}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
