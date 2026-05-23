interface Props {
  codes: string[];
}

export function AvailableCourses({ codes }: Props) {
  return (
    <section className="card card-pad">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold tracking-tight text-white">Available next term</h3>
        <span className="chip chip-blue">{codes.length} courses</span>
      </header>
      <p className="mb-3 text-sm text-white/50">
        Catalog courses you haven&apos;t taken whose prerequisites are already complete.
      </p>

      {codes.length === 0 ? (
        <p className="text-sm text-white/50">
          Nothing is unlocked yet. Complete an intro course like{" "}
          <span className="font-mono text-white/70">CSCE 1030</span> or{" "}
          <span className="font-mono text-white/70">MATH 1710</span> to begin.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-1.5">
          {codes.map((code) => (
            <li key={code} className="chip chip-blue font-mono">
              {code}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
