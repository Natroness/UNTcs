interface Props {
  codes: string[];
}

export function RemainingCourses({ codes }: Props) {
  return (
    <div className="card card-pad">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-tight text-white">Remaining required</h3>
        <span className="chip chip-amber">{codes.length} courses</span>
      </div>

      {codes.length === 0 ? (
        <p className="text-sm text-emerald-300">
          All required courses are complete. Verify electives and choice groups above.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-1.5">
          {codes.map((code) => (
            <li key={code} className="chip chip-amber font-mono">{code}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
