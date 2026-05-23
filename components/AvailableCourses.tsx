interface Props {
  codes: string[];
}

export function AvailableCourses({ codes }: Props) {
  return (
    <div className="card card-pad">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-tight text-white">Available next term</h3>
        <span className="chip chip-blue">{codes.length} courses</span>
      </div>
      <p className="mb-4 text-sm text-[#84a5aa]">
        Catalog courses whose prerequisites are already complete.
      </p>

      {codes.length === 0 ? (
        <p className="text-sm text-[#84a5aa]">
          Nothing unlocked yet — complete an intro course like{" "}
          <span className="font-mono text-white/60">CSCE 1030</span> or{" "}
          <span className="font-mono text-white/60">MATH 1710</span> to begin.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-1.5">
          {codes.map((code) => (
            <li key={code} className="chip chip-blue font-mono">{code}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
