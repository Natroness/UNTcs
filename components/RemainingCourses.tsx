interface Props {
  codes: string[];
}

export function RemainingCourses({ codes }: Props) {
  return (
    <section className="card card-pad">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold tracking-tight text-white">Remaining required</h3>
        <span className="chip chip-amber">{codes.length} courses</span>
      </header>

      {codes.length === 0 ? (
        <p className="text-sm text-emerald-300">
          All required courses are complete. Verify electives and choice groups below.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-1.5">
          {codes.map((code) => (
            <li key={code} className="chip chip-amber font-mono">
              {code}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
