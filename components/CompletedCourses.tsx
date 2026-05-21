import type { CompletedCourse } from "@/types/course";

interface Props {
  codes: string[];
  unknown?: string[];
  /**
   * Optional transfer-audit provenance: surfaces which courses were satisfied
   * via accepted transfer credit and the original course code when known.
   */
  transferDetail?: CompletedCourse[];
}

export function CompletedCourses({ codes, unknown = [], transferDetail = [] }: Props) {
  const detailByCode = new Map(transferDetail.map((d) => [d.untEquivalentCode, d]));

  return (
    <section className="card card-pad">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold tracking-tight">Completed</h3>
        <span className="chip chip-green">{codes.length} courses</span>
      </header>

      {codes.length === 0 ? (
        <p className="text-sm text-slate-500">No completed courses recognized yet.</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {codes.map((code) => {
            const detail = detailByCode.get(code);
            return (
              <li key={code} className="flex flex-wrap items-center gap-2 text-sm">
                <span className="chip chip-green font-mono">{code}</span>
                {detail?.source === "TRANSFER" ? (
                  <span
                    className="chip"
                    style={{ borderColor: "#7C3AED", color: "#5B21B6", background: "#F5F3FF" }}
                  >
                    TRANSFER
                  </span>
                ) : null}
                {detail?.originalTransferCode ? (
                  <span className="text-xs text-slate-500">
                    from <span className="font-mono">{detail.originalTransferCode}</span>
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      {unknown.length > 0 ? (
        <div className="mt-4 border-t border-slate-100 pt-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            Not in catalog
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {unknown.map((code) => (
              <li key={code} className="chip font-mono">
                {code}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            These were normalized but are not part of the tracked catalog. They are kept for your reference.
          </p>
        </div>
      ) : null}
    </section>
  );
}
