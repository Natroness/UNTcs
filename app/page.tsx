import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-12">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-emerald-50 p-8 shadow-card sm:p-12">
        <div className="max-w-2xl">
          <span className="chip chip-green">UNT Computer Science · MVP</span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Plan your CS degree with a clean, fast audit.
          </h1>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            Enter completed courses or paste transcript text. The tracker normalizes codes, runs a
            prerequisite-aware audit, and shows what you can take next.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-lg bg-unt-green px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
            >
              Start an audit
            </Link>
            <Link
              href="/dag"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              View prerequisite DAG
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Feature
          title="Normalize anything"
          body="csce1030, CSCE-1030, csce 1030 all become CSCE 1030. Duplicates and unknown codes are cleaned automatically."
        />
        <Feature
          title="Real audit logic"
          body="Required vs. remaining, available next term, and locked courses with the exact missing prerequisites."
        />
        <Feature
          title="Prereq graph"
          body="A topologically laid out React Flow DAG of the catalog so you can see how courses connect."
        />
      </section>

      <section className="card card-pad">
        <h2 className="text-lg font-semibold tracking-tight">How it works</h2>
        <ol className="mt-3 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
          <Step n={1} title="Enter courses">
            Manual entry or paste your unofficial transcript text.
          </Step>
          <Step n={2} title="Audit runs locally">
            Codes are normalized and compared against the catalog in milliseconds.
          </Step>
          <Step n={3} title="Plan next term">
            See what&apos;s unlocked, what&apos;s blocked, and why.
          </Step>
        </ol>
      </section>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="card card-pad">
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-600">{body}</p>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
      <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-unt-green text-xs font-bold text-white">
        {n}
      </span>
      <div>
        <div className="font-semibold text-slate-900">{title}</div>
        <div className="text-sm text-slate-600">{children}</div>
      </div>
    </li>
  );
}
