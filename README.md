# UNT CS Degree Tracker

Next.js + TypeScript + Tailwind MVP that audits a UNT B.S. in Computer Science plan. Paste completed courses or transcript text and see completed, remaining, available, and locked courses plus an interactive prerequisite DAG.

## Stack

- Next.js 14 (App Router)
- TypeScript (strict)
- Tailwind CSS
- React Flow (prerequisite graph)

## Run

```bash
npm install
npm run dev
```

App runs at http://localhost:3000.

## Project layout

```
app/
  page.tsx              Landing
  dashboard/page.tsx    Audit dashboard (input + results)
  dag/page.tsx          Prerequisite DAG
  api/audit/route.ts    POST { completedCourses: string[] } -> AuditResult
  api/transcript/route.ts POST { text: string } -> { courses: string[] }
components/             UI only; all logic lives in lib/
data/unt-cs-catalog.json  Course catalog
lib/                    Pure audit + parsing logic
types/course.ts         Type contracts
```

## How to test the MVP

1. `npm install && npm run dev`
2. Open `/dashboard`.
3. Pick "Manual" and paste, e.g.:
   ```
   csce 1030
   CSCE-1040
   math 1710
   ```
   Click "Run audit". You should see:
   - Progress: 3 / total required
   - Available: `CSCE 2100`, `CSCE 2610`, `MATH 1720`, `MATH 2700`, ...
   - Locked: `CSCE 2110` blocked by `CSCE 2100`, `CSCE 3110` blocked by `CSCE 2110`, etc.
4. Switch to "Transcript text" and paste arbitrary text containing course codes (`Term Fall 2024 CSCE 1030 Computer Science I A`). The parser pulls codes out and audits them.
5. Open `/dag` to view the prerequisite graph.

## Notes / constraints

- No database, no auth, no PDF parsing in this MVP.
- Catalog data is a simplified UNT CS BS; verify with the official catalog before academic decisions.
- All audit/prerequisite logic lives in `lib/` so it can be unit-tested or reused server-side.
