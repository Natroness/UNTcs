export function AuditClaritySection() {
  return (
    <section className="bg-[#0f0f0f] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="section-title">Audit clarity at a glance</h2>
          <p className="section-sub">
            See required vs. remaining courses, what&apos;s unlocked next term, and exactly which
            prerequisites are still blocking you.
          </p>
        </div>

        <div className="mt-16 grid items-start gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          {/* Progress card */}
          <div className="rounded-2xl border border-white/12 bg-gradient-to-b from-[rgba(47,255,208,0.10)] to-transparent p-7 sm:p-9">
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#84a5aa]">Degree progress</p>
                <p className="mt-1 text-5xl font-bold text-white">68%</p>
              </div>
              <span className="badge">Example audit</span>
            </div>

            {/* Mock chart */}
            <div className="relative h-44 overflow-hidden rounded-xl border border-white/10 bg-black/40 sm:h-52">
              <svg viewBox="0 0 400 160" className="h-full w-full" aria-hidden="true">
                <defs>
                  <linearGradient id="chartGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2fffd0" />
                    <stop offset="100%" stopColor="#00853E" />
                  </linearGradient>
                </defs>
                <path
                  d="M20 135 C80 120, 120 100, 160 80 S240 45, 380 18"
                  fill="none" stroke="url(#chartGrad)" strokeWidth="2.5" strokeLinecap="round"
                />
                <path
                  d="M20 145 C100 138, 140 115, 200 100 S300 76, 380 56"
                  fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" opacity="0.6"
                />
              </svg>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[["Completed", "24"], ["Remaining", "11"], ["Available", "4"]].map(([label, val]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs font-medium text-[#84a5aa]">{label}</p>
                  <p className="mt-1 text-2xl font-bold text-white">{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Side glow cards */}
          <div className="flex flex-col gap-5">
            {[
              ["Required courses", "35 tracked"],
              ["Prereqs checked", "Every catalog edge"],
            ].map(([title, val]) => (
              <div key={title} className="rounded-xl border border-white/12 bg-gradient-to-b from-[rgba(47,255,208,0.14)] to-transparent px-6 py-8">
                <p className="text-sm font-medium text-[#84a5aa]">{title}</p>
                <p className="mt-2 text-2xl font-bold text-white">{val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature cards */}
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            { title: "Normalize anything", body: "csce1030, CSCE-1030, csce 1030 all become CSCE 1030. Duplicates cleaned automatically.", bg: "bg-[#f5efb0] text-black" },
            { title: "Real audit logic", body: "Required vs. remaining, available next term, and locked courses with exact missing prerequisites.", bg: "bg-[#91f2cf] text-black" },
            { title: "Prereq graph", body: "A topologically laid out React Flow DAG of the catalog so you can see how courses connect.", bg: "bg-[#b8d9ff] text-black" },
          ].map((f) => (
            <article key={f.title} className={`rounded-2xl p-7 ${f.bg}`}>
              <h3 className="text-xl font-bold tracking-tight">{f.title}</h3>
              <p className="mt-3 text-base leading-relaxed opacity-75">{f.body}</p>
            </article>
          ))}
        </div>

        {/* Testimonial */}
        <div className="mx-auto mt-10 max-w-5xl rounded-2xl border border-white/12 bg-gradient-to-b from-[rgba(47,255,208,0.07)] to-transparent px-8 py-10 text-center sm:px-12">
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#84a5aa]">
            &ldquo;I pasted my transcript and immediately saw which CSCE courses I could register
            for next semester — and why the rest were locked.&rdquo;
          </p>
          <div className="mt-7 flex flex-col items-center gap-1">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-[#91f2cf] text-lg font-bold text-black">
              CS
            </div>
            <p className="font-semibold text-white">UNT CS Student</p>
            <p className="text-sm text-[#84a5aa]">Junior · Degree planning</p>
          </div>
        </div>
      </div>
    </section>
  );
}
