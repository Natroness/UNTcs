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
          <h3 className="text-base font-semibold tracking-tight text-white">Degree progress</h3>
          <p className="text-sm text-white/50">Required courses only.</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-semibold tabular-nums tracking-tight text-landing-teal">
            {progress.percent}%
          </div>
          <div className="text-xs text-white/40">
            {progress.completedRequired} / {progress.totalRequired} required
          </div>
        </div>
      </header>

      <div
        className="h-2 w-full overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuenow={progress.percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-landing-teal transition-all"
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
        <div className="mt-5 border-t border-white/10 pt-4">
          <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-white/40">
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
                    <span className="font-medium text-white">{e.title}</span>
                    <span className="tabular-nums text-white/40">
                      {e.earnedCredits} / {e.requiredCredits} cr
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full ${
                        e.satisfied ? "bg-emerald-400" : "bg-sky-400"
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
    green: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
    amber: "text-amber-300 bg-amber-400/10 border-amber-400/20",
    blue: "text-sky-300 bg-sky-400/10 border-sky-400/20",
    red: "text-rose-300 bg-rose-400/10 border-rose-400/20",
  };
  return (
    <div className={`rounded-xl border px-3 py-2.5 ${toneClasses[tone]}`}>
      <dt className="text-xs font-medium uppercase tracking-wide opacity-70">{label}</dt>
      <dd className="text-xl font-semibold tabular-nums">{value}</dd>
    </div>
  );
}
