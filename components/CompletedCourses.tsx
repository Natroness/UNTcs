import type { CompletedCourse } from "@/types/course";

interface Props {
  codes: string[];
  unknown?: string[];
  transferDetail?: CompletedCourse[];
}

export function CompletedCourses({ codes, unknown = [], transferDetail = [] }: Props) {
  const detailByCode = new Map(transferDetail.map((d) => [d.untEquivalentCode, d]));

  return (
    <div className="card card-pad">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-tight text-white">Completed</h3>
        <span className="chip chip-green">{codes.length} courses</span>
      </div>

      {codes.length === 0 ? (
        <p className="text-sm text-[#84a5aa]">No completed courses recognized yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {codes.map((code) => {
            const detail = detailByCode.get(code);
            return (
              <li key={code} className="flex flex-wrap items-center gap-2">
                <span className="chip chip-green font-mono">{code}</span>
                {detail?.source === "TRANSFER" ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-violet-400/30 bg-violet-400/10 px-2.5 py-1 text-xs font-semibold text-violet-300">
                    TRANSFER
                  </span>
                ) : null}
                {detail?.originalTransferCode ? (
                  <span className="text-xs text-[#84a5aa]">
                    from <span className="font-mono text-white/50">{detail.originalTransferCode}</span>
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      {unknown.length > 0 ? (
        <div className="mt-5 border-t border-white/10 pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#84a5aa]">
            Not in catalog
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {unknown.map((code) => (
              <li key={code} className="chip font-mono">{code}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-[#84a5aa]">
            Normalized but not in the tracked catalog. Kept for reference.
          </p>
        </div>
      ) : null}
    </div>
  );
}
