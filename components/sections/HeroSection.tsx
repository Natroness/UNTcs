const COURSE_CODES = ["CSCE 1030", "CSCE 1040", "CSCE 2100", "CSCE 3110", "CSCE 4110", "MATH 1710"];

export function HeroSection() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#ceffb8] via-[#91f2cf] to-[#0f0f0f] px-6 pb-0 pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-2">
            <StarIcon />
            <p className="text-base font-semibold text-black/80">
              UNT Computer Science <span className="font-medium text-black/50">· MVP</span>
            </p>
          </div>

          <h1 className="mt-5 max-w-3xl mx-auto text-5xl font-bold leading-[1.04] tracking-[-0.03em] text-[#0e1125] sm:text-6xl lg:text-7xl">
            Plan your CS degree with a clean, fast audit.
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-lg font-medium leading-relaxed text-black/70 sm:text-xl">
            Enter completed courses or paste transcript text. The tracker normalizes codes, runs a
            prerequisite-aware audit, and shows what you can take next.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#dashboard"
              className="rounded-[10px] border border-black bg-black px-7 py-4 text-base font-semibold text-white transition hover:bg-black/80"
            >
              Start an audit
            </a>
            <a
              href="#prereq-dag"
              className="rounded-[10px] border border-black bg-white/30 px-7 py-4 text-base font-semibold text-black backdrop-blur-sm transition hover:bg-white/50"
            >
              View prerequisite DAG
            </a>
          </div>

          <div className="mt-16" />
        </div>
      </section>

      {/* Course code bar */}
      <section className="border-y border-white/10 bg-[#0f0f0f] py-7">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6">
          {COURSE_CODES.map((code) => (
            <span key={code} className="text-sm font-semibold tracking-[0.12em] text-white/40 sm:text-base">
              {code}
            </span>
          ))}
        </div>
      </section>
    </>
  );
}

function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="text-black/70">
      <path d="M12 2l2.9 6.9L22 9.8l-5.2 4.5 1.6 6.7L12 17.8l-6.4 3.2 1.6-6.7L2 9.8l7.1-.9L12 2z" />
    </svg>
  );
}
