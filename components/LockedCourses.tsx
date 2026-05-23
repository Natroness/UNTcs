import type { LockedCourse } from "@/types/course";

interface Props {
  locked: LockedCourse[];
}

export function LockedCourses({ locked }: Props) {
  return (
    <section className="card card-pad">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold tracking-tight text-white">Locked</h3>
        <span className="chip chip-red">{locked.length} courses</span>
      </header>
      <p className="mb-3 text-sm text-white/50">
        Courses blocked by unmet prerequisites. Corequisites do not lock a course.
      </p>

      {locked.length === 0 ? (
        <p className="text-sm text-white/50">Nothing locked. Every remaining course is reachable.</p>
      ) : (
        <ul className="divide-y divide-white/5">
          {locked.map((c) => (
            <li key={c.code} className="py-2.5 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-sm font-semibold text-white">{c.code}</span>
                <span className="text-xs text-white/40">
                  needs {c.missingPrerequisites.length} prereq
                  {c.missingPrerequisites.length === 1 ? "" : "s"}
                </span>
              </div>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {c.missingPrerequisites.map((p) => (
                  <li key={p} className="chip chip-red font-mono">
                    {p}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
