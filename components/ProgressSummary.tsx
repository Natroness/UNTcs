import type { AuditResult } from "@/types/course";

interface Props {
  audit: AuditResult;
}

export function ProgressSummary({ audit }: Props) {
  const { progress, available, locked, electives } = audit;

  return (
    <section className="card card-pad">
      <header className="mb-4 flex items-end justify-between">
        <div>
          <h3 className="text-base font-semibold tracking-tight">Degree progress</h3>
          <p className="text-sm text-slate-500">Required courses only.</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-semibold tabular-nums tracking-tight text-slate-900">
            {progress.percent}%
          </div>
          <div className="text-xs text-slate-500">
            {progress.completedRequired} / {progress.totalRequired} required
          </div>
        </div>
      </header>

      <div
        className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuenow={progress.percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-unt-green transition-all"
          style={{ width: `${progress.percent}%` }}
        />
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Completed" value={progress.completedRequired} tone="green" />
        <Stat label="Remaining" value={progress.totalRequired - progress.completedRequired} tone="amber" />
        <Stat label="Available" value={available.length} tone="blue" />
        <Stat label="Locked" value={locked.length} tone="red" />
      </dl>

      {electives.length > 0 ? (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            Electives
          </h4>
          <ul className="space-y-2">
            {electives.map((e) => {
              const pct =
                e.requiredCredits === 0
                  ? 0
                  : Math.min(100, Math.round((e.earnedCredits / e.requiredCredits) * 100));
              return (
                <li key={e.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-800">{e.title}</span>
                    <span className="tabular-nums text-slate-500">
                      {e.earnedCredits} / {e.requiredCredits} cr
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${
                        e.satisfied ? "bg-emerald-500" : "bg-sky-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "green" | "amber" | "blue" | "red";
}) {
  const toneClasses: Record<typeof tone, string> = {
    green: "text-emerald-700 bg-emerald-50 border-emerald-100",
    amber: "text-amber-800 bg-amber-50 border-amber-100",
    blue: "text-sky-700 bg-sky-50 border-sky-100",
    red: "text-rose-700 bg-rose-50 border-rose-100",
  };
  return (
    <div className={`rounded-xl border px-3 py-2.5 ${toneClasses[tone]}`}>
      <dt className="text-xs font-medium uppercase tracking-wide opacity-80">{label}</dt>
      <dd className="text-xl font-semibold tabular-nums">{value}</dd>
    </div>
  );
}
