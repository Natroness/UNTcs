"use client";

import { useEffect, useState } from "react";

interface Props {
  onSubmit: (input: { mode: "manual" | "transcript"; value: string }) => void;
  loading?: boolean;
  error?: string | null;
  initialValue?: string;
}

export function CourseInput({ onSubmit, loading, error, initialValue }: Props) {
  const [mode, setMode] = useState<"manual" | "transcript">("manual");
  const [value, setValue] = useState(initialValue ?? "");

  useEffect(() => {
    if (initialValue !== undefined) setValue(initialValue);
  }, [initialValue]);

  const placeholder =
    mode === "manual"
      ? "Enter one course per line or separated by commas.\nCSCE 1030\ncsce-1040\nMATH 1710"
      : "Paste your unofficial transcript text here. Course codes like CSCE 1030 or MATH-1710 will be detected automatically.";

  return (
    <div className="card card-pad">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Enter your courses</h2>
          <p className="mt-1 text-sm text-[#84a5aa]">
            Manual entry or paste transcript text — we normalize and audit it.
          </p>
        </div>
        {/* Figma-style tab toggle */}
        <div className="inline-flex rounded-[10px] border border-white/15 bg-white/5 p-1 text-sm">
          {(["manual", "transcript"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={
                "rounded-[8px] px-4 py-2 font-semibold transition " +
                (mode === m
                  ? "bg-landing-teal text-black shadow-sm"
                  : "text-white/50 hover:text-white")
              }
            >
              {m === "manual" ? "Manual" : "Transcript"}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        rows={mode === "transcript" ? 10 : 6}
        className="w-full resize-y rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-sm leading-6 text-white outline-none placeholder:text-white/20 transition focus:border-landing-teal/50 focus:ring-2 focus:ring-landing-teal/20"
      />

      {error ? (
        <p className="mt-3 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-white/30">
          Codes normalized to <span className="font-mono text-white/50">DEPT 1234</span>. Duplicates removed.
        </p>
        <button
          type="button"
          disabled={loading || value.trim().length === 0}
          onClick={() => onSubmit({ mode, value })}
          className="rounded-[10px] bg-landing-teal px-6 py-2.5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Auditing…" : mode === "manual" ? "Run audit" : "Parse and audit"}
        </button>
      </div>
    </div>
  );
}
