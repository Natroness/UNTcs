import type { AuditResult } from "@/types/course";

interface Props {
  audit: AuditResult;
}

export function ProgressSummary({ audit }: Props) {
  const { progress, available, locked, electives } = audit;

  return (
    <div className="flex flex-col gap-5">
      {/* Big progress card — Figma "results" style */}
      <div className="rounded-2xl border border-white/15 bg-gradient-to-b from-emerald-400/10 to-transparent p-6 sm:p-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#84a5aa]">Degree progress</p>
            <p className="mt-1 text-5xl font-bold tabular-nums tracking-tight text-white">
              {progress.percent}%
            </p>
            <p className="mt-1 text-xs text-[#84a5aa]">
              {progress.completedRequired} / {progress.totalRequired} required courses
            </p>
          </div>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            Live audit
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={progress.percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-landing-teal transition-all duration-500"
            style={{ width: `${progress.percent}%` }}
          />
        </div>

        {/* Stat pills — Figma StatPill style */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatPill label="Completed" value={progress.completedRequired} tone="green" />
          <StatPill label="Remaining" value={progress.totalRequired - progress.completedRequired} tone="amber" />
          <StatPill label="Available" value={available.length} tone="blue" />
          <StatPill label="Locked" value={locked.length} tone="red" />
        </div>
      </div>

      {/* Electives */}
      {electives.length > 0 ? (
        <div className="card card-pad">
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#84a5aa]">
            Elective Groups
          </h4>
          <ul className="space-y-4">
            {electives.map((e) => {
              const pct =
                e.requiredCredits === 0
                  ? 0
                  : Math.min(100, Math.round((e.earnedCredits / e.requiredCredits) * 100));
              return (
                <li key={e.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-white">{e.title}</span>
                    <span className="tabular-nums text-[#84a5aa]">
                      {e.earnedCredits} / {e.requiredCredits} cr
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full transition-all ${
                        e.satisfied ? "bg-landing-teal" : "bg-sky-400"
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
    </div>
  );
}

function StatPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "green" | "amber" | "blue" | "red";
}) {
  const cls: Record<typeof tone, string> = {
    green: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    amber: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    blue: "border-sky-400/20 bg-sky-400/10 text-sky-300",
    red: "border-rose-400/20 bg-rose-400/10 text-rose-300",
  };
  return (
    <div className={`rounded-xl border px-4 py-3 ${cls[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
    </div>
  );
}
