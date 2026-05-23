import Link from "next/link";

const COURSE_CODES = ["CSCE 1030", "CSCE 1040", "CSCE 2100", "CSCE 3110", "CSCE 4110", "MATH 1710"];

export default function LandingPage() {
  return (
    <div className="font-sans text-black">
      <Hero />
      <CourseCodeBar />
      <AuditResults />
      <FeatureCards />
      <HowItWorks />
      <FinalCta />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-landing-hero">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-black text-sm font-bold text-landing-cream">
            U
          </span>
          <span className="text-lg font-semibold tracking-tight text-[#0e1125]">UNT CS Tracker</span>
        </Link>
        <div className="hidden items-center gap-10 text-[13px] font-semibold text-[#222] md:flex">
          <Link href="/dashboard" className="transition hover:text-black/70">
            Dashboard
          </Link>
          <Link href="/transfer-audit" className="transition hover:text-black/70">
            Transfer Audit
          </Link>
          <Link href="/dag" className="transition hover:text-black/70">
            Prereq DAG
          </Link>
        </div>
        <Link
          href="/dashboard"
          className="rounded-[10px] border border-black bg-black px-5 py-2.5 text-sm font-semibold text-landing-cream transition hover:bg-black/90"
        >
          Start audit
        </Link>
      </nav>

      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 pb-24 pt-10 text-center sm:px-6 sm:pt-14 sm:pb-32">
        <div className="flex items-center gap-2">
          <StarIcon />
          <p className="text-base font-semibold">
            UNT Computer Science <span className="font-medium text-[#616161]">· MVP</span>
          </p>
        </div>

        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-0.02em] sm:text-5xl lg:text-[4.25rem] lg:leading-[1.02]">
          Plan your CS degree with a clean, fast audit.
        </h1>
        <p className="mt-5 max-w-xl text-lg font-medium leading-relaxed text-black/80 sm:text-xl">
          Enter completed courses or paste transcript text. The tracker normalizes codes, runs a
          prerequisite-aware audit, and shows what you can take next.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-[10px] border border-black bg-white/20 px-6 py-4 text-base font-semibold backdrop-blur-sm transition hover:bg-white/40"
          >
            Start an audit
          </Link>
          <Link
            href="/dag"
            className="rounded-[10px] border border-black bg-black px-8 py-4 text-base font-semibold text-landing-cream transition hover:bg-black/90"
          >
            View prerequisite DAG
          </Link>
        </div>
      </div>
    </section>
  );
}

function CourseCodeBar() {
  return (
    <section className="border-y border-white/10 bg-landing-dark py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 sm:px-6">
        {COURSE_CODES.map((code) => (
          <span
            key={code}
            className="text-sm font-semibold tracking-[0.12em] text-white/70 sm:text-base"
          >
            {code}
          </span>
        ))}
      </div>
    </section>
  );
}

function AuditResults() {
  return (
    <section className="bg-landing-dark px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-[-0.02em] text-white sm:text-5xl">
            Audit clarity at a glance
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-landing-muted sm:text-xl">
            See required vs. remaining courses, what&apos;s unlocked next term, and exactly which
            prerequisites are still blocking you.
          </p>
        </div>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-emerald-400/10 to-transparent p-6 sm:p-8">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-landing-muted">Degree progress</p>
                <p className="mt-1 text-3xl font-bold text-white sm:text-4xl">68%</p>
              </div>
              <p className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                Example audit
              </p>
            </div>
            <div className="relative h-48 overflow-hidden rounded-xl border border-white/10 bg-black/40 sm:h-56">
              <svg viewBox="0 0 400 180" className="h-full w-full" aria-hidden="true">
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3cffce" />
                    <stop offset="100%" stopColor="#00853E" />
                  </linearGradient>
                </defs>
                <path
                  d="M20 150 C80 140, 120 120, 160 100 S240 60, 380 30"
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M20 160 C100 155, 140 130, 200 115 S300 90, 380 70"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </svg>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <StatPill label="Completed" value="24" />
              <StatPill label="Remaining" value="11" />
              <StatPill label="Available" value="4" />
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <GlowCard title="Required courses" value="35 tracked" />
            <GlowCard title="Prereqs checked" value="Every catalog edge" />
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-5xl rounded-xl border border-white/15 bg-gradient-to-b from-emerald-400/10 to-transparent px-6 py-10 text-center sm:px-10">
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-landing-muted">
            &ldquo;I pasted my transcript and immediately saw which CSCE courses I could register
            for next semester — and why the rest were locked.&rdquo;
          </p>
          <div className="mt-6 flex flex-col items-center gap-1">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-landing-mid text-lg font-bold text-black">
              CS
            </div>
            <p className="font-semibold text-landing-cream">UNT CS Student</p>
            <p className="text-sm text-landing-muted">Junior · Degree planning</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCards() {
  const features = [
    {
      title: "Normalize anything",
      body: "csce1030, CSCE-1030, csce 1030 all become CSCE 1030. Duplicates and unknown codes are cleaned automatically.",
      className: "bg-[#f5efb0] text-black",
    },
    {
      title: "Real audit logic",
      body: "Required vs. remaining, available next term, and locked courses with the exact missing prerequisites.",
      className: "bg-[#91f2cf] text-black",
    },
    {
      title: "Prereq graph",
      body: "A topologically laid out React Flow DAG of the catalog so you can see how courses connect.",
      className: "bg-[#b8d9ff] text-black",
    },
  ];

  return (
    <section className="bg-landing-dark px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-[-0.02em] text-white sm:text-5xl">
            Everything you need to plan ahead
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-landing-muted sm:text-xl">
            Built for UNT CS students who want a faster, clearer picture of degree progress without
            digging through PDFs.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className={`rounded-2xl p-6 sm:p-8 ${feature.className}`}
            >
              <h3 className="text-xl font-bold tracking-tight">{feature.title}</h3>
              <p className="mt-3 text-base leading-relaxed opacity-80">{feature.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: 1,
      title: "Enter courses",
      body: "Manual entry or paste your unofficial transcript text.",
    },
    {
      n: 2,
      title: "Audit runs locally",
      body: "Codes are normalized and compared against the catalog in milliseconds.",
    },
    {
      n: 3,
      title: "Plan next term",
      body: "See what's unlocked, what's blocked, and why.",
    },
  ];

  return (
    <section className="bg-landing-soft px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-4xl font-bold tracking-[-0.02em] sm:text-5xl">
          How it works
        </h2>

        <div className="mx-auto mt-12 max-w-5xl rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-10">
          <ol className="grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <li key={step.n} className="flex flex-col gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-black text-sm font-bold text-landing-cream">
                  {step.n}
                </span>
                <div>
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-[#616161]">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-landing-hero px-4 py-20 sm:px-6 sm:py-28">
      <div className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 sm:block">
        <span className="inline-block rotate-[-12deg] rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-bold tracking-widest">
          FREE TO USE
        </span>
      </div>
      <div className="pointer-events-none absolute right-8 top-8 text-3xl">✦</div>

      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-bold tracking-[-0.02em] sm:text-5xl">
          Ready to plan your next term?
        </h2>
        <p className="mt-4 text-lg font-medium leading-relaxed text-black/80 sm:text-xl">
          Run a prerequisite-aware audit in seconds and see exactly which CS courses you can take
          next.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-[10px] border border-black bg-white/30 px-6 py-4 text-base font-semibold backdrop-blur-sm transition hover:bg-white/50"
          >
            Start an audit
          </Link>
          <Link
            href="/transfer-audit"
            className="rounded-[10px] border border-black bg-black px-8 py-4 text-base font-semibold text-landing-cream transition hover:bg-black/90"
          >
            Transfer audit
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-landing-dark px-4 py-14 text-landing-cream sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white/50">Product</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="transition hover:text-white">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/dag" className="transition hover:text-white">
                Prereq DAG
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white/50">Resources</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/transfer-audit" className="transition hover:text-white">
                Transfer Audit
              </Link>
            </li>
            <li>
              <a
                href="https://catalog.unt.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white"
              >
                UNT Catalog
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-8 text-center text-xs text-landing-muted">
        MVP audit only. Verify all requirements with the official UNT catalog and advisor.
      </p>
    </footer>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-xs font-medium text-landing-muted">{label}</p>
      <p className="mt-1 text-xl font-bold text-white">{value}</p>
    </div>
  );
}

function GlowCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/15 bg-gradient-to-b from-emerald-400/20 to-transparent px-6 py-8">
      <p className="text-sm font-medium text-landing-muted">{title}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.9 6.9L22 9.8l-5.2 4.5 1.6 6.7L12 17.8l-6.4 3.2 1.6-6.7L2 9.8l7.1-.9L12 2z" />
    </svg>
  );
}
