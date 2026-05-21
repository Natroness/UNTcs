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
          <h2 className="text-lg font-semibold tracking-tight">Enter your courses</h2>
          <p className="text-sm text-slate-500">
            Manual entry or paste transcript text. We will normalize and audit it.
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-sm">
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={
              "rounded-md px-3 py-1.5 transition " +
              (mode === "manual"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800")
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
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800")
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
        className="w-full resize-y rounded-xl border border-slate-200 bg-white p-3 font-mono text-sm leading-6 outline-none transition focus:border-unt-green focus:ring-2 focus:ring-unt-green/20"
      />

      {error ? (
        <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          Codes are normalized to <span className="font-mono">DEPT 1234</span>. Duplicates are removed.
        </p>
        <button
          type="button"
          disabled={loading || value.trim().length === 0}
          onClick={() => onSubmit({ mode, value })}
          className="inline-flex items-center justify-center rounded-lg bg-unt-green px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Auditing..." : mode === "manual" ? "Run audit" : "Parse and audit"}
        </button>
      </div>
    </section>
  );
}
