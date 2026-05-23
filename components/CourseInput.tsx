"use client";

import { useEffect, useState } from "react";

interface Props {
  onSubmit: (input: { mode: "manual" | "transcript"; value: string }) => void;
  loading?: boolean;
  error?: string | null;
  /** Optional initial textarea value (e.g. pre-filled from a transfer audit). */
  initialValue?: string;
}

export function CourseInput({ onSubmit, loading, error, initialValue }: Props) {
  const [mode, setMode] = useState<"manual" | "transcript">("manual");
  const [value, setValue] = useState(initialValue ?? "");

  useEffect(() => {
    if (initialValue !== undefined) {
      setValue(initialValue);
    }
  }, [initialValue]);

  const placeholder =
    mode === "manual"
      ? "Enter one course per line or separated by commas. e.g.\nCSCE 1030\ncsce-1040\nMATH 1710"
      : "Paste your unofficial transcript text here. Course codes like CSCE 1030 or MATH-1710 will be detected automatically.";

  return (
    <section className="card card-pad">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-white">Enter your courses</h2>
          <p className="text-sm text-white/50">
            Manual entry or paste transcript text. We will normalize and audit it.
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-white/10 bg-white/5 p-0.5 text-sm">
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={
              "rounded-md px-3 py-1.5 transition " +
              (mode === "manual"
                ? "bg-white/10 text-white shadow-sm"
                : "text-white/50 hover:text-white")
            }
          >
            Manual
          </button>
          <button
            type="button"
            onClick={() => setMode("transcript")}
            className={
              "rounded-md px-3 py-1.5 transition " +
              (mode === "transcript"
                ? "bg-white/10 text-white shadow-sm"
                : "text-white/50 hover:text-white")
            }
          >
            Transcript text
          </button>
        </div>
      </header>

      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        rows={mode === "transcript" ? 10 : 6}
        className="w-full resize-y rounded-xl border border-white/10 bg-[#1a1a1a] p-3 font-mono text-sm leading-6 text-white outline-none placeholder:text-white/25 transition focus:border-landing-teal/50 focus:ring-2 focus:ring-landing-teal/20"
      />

      {error ? (
        <p className="mt-3 rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-300">
          {error}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-white/40">
          Codes are normalized to <span className="font-mono">DEPT 1234</span>. Duplicates are removed.
        </p>
        <button
          type="button"
          disabled={loading || value.trim().length === 0}
          onClick={() => onSubmit({ mode, value })}
          className="inline-flex items-center justify-center rounded-lg bg-landing-teal px-4 py-2 text-sm font-semibold text-black shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Auditing…" : mode === "manual" ? "Run audit" : "Parse and audit"}
        </button>
      </div>
    </section>
  );
}
