"use client";

import { useId, useMemo } from "react";
import { catalog } from "@/lib/catalog";
import type { CourseStatus } from "@/types/course";

// ── Layout constants ────────────────────────────────────────────────────────
const CPX = 24;     // canvas padding X
const CPY = 28;     // canvas padding Y
const COL_W = 212;  // semester column width
const COL_G = 14;   // gap between columns
const CARD_W = 192; // card width
const CARD_H = 68;  // card height
const CARD_G = 8;   // vertical gap between cards
const HEAD_H = 52;  // semester header height
const CARD_PX = (COL_W - CARD_W) / 2; // = 10, card left indent within column

const colX    = (i: number) => CPX + i * (COL_W + COL_G);
const cardLx  = (i: number) => colX(i) + CARD_PX;
const cardRx  = (i: number) => colX(i) + CARD_PX + CARD_W;
const cardCx  = (i: number) => colX(i) + COL_W / 2;
const cardTopY = (row: number) => CPY + HEAD_H + 6 + row * (CARD_H + CARD_G);
const cardBotY = (row: number) => cardTopY(row) + CARD_H;
const cardCy   = (row: number) => cardTopY(row) + CARD_H / 2;

// Elective zone (below main semesters)
const MAX_ROWS       = 4; // Y2 Spring and Y3 Fall each have 4 courses
const MAIN_BOTTOM    = cardBotY(MAX_ROWS - 1);
const EZ_TOP_GAP     = 56;
const EZ_Y           = MAIN_BOTTOM + EZ_TOP_GAP; // top of elective zone
const EZ_HEAD_H      = 28; // section label height
const EZ_CARD_H      = 62;
const EZ_CARD_W      = 196;
const EZ_ROW_G       = 10; // gap between elective rows

const CORE_SECTION_Y    = EZ_Y;
const CORE_CARDS_Y      = CORE_SECTION_Y + EZ_HEAD_H;
const BREADTH_SECTION_Y = CORE_CARDS_Y + EZ_CARD_H + EZ_ROW_G;
const BREADTH_CARDS_Y   = BREADTH_SECTION_Y + EZ_HEAD_H;
const MATH_SECTION_Y    = BREADTH_CARDS_Y + EZ_CARD_H + EZ_ROW_G;
const MATH_CARDS_Y      = MATH_SECTION_Y + EZ_HEAD_H;

const NUM_COLS = 8;
const TOTAL_W  = CPX + NUM_COLS * (COL_W + COL_G) - COL_G + CPX;
const TOTAL_H  = MATH_CARDS_Y + EZ_CARD_H + CPY;
const IW       = TOTAL_W - 2 * CPX; // inner width for elective spacing

// Elective course lists
const CORE_ELECTIVES    = ["CSCE 3530", "CSCE 4115", "CSCE 4430", "CSCE 4600", "CSCE 4650"] as const;
const BREADTH_ELECTIVES = ["CSCE 4201", "CSCE 4210", "CSCE 4230", "CSCE 4240", "CSCE 4290", "CSCE 4350", "CSCE 4460"] as const;
const MATH_ELECTIVE     = "MATH 3680";

const coreExFn    = (i: number) =>
  CPX + i * (IW / CORE_ELECTIVES.length) + (IW / CORE_ELECTIVES.length - EZ_CARD_W) / 2;
const breadthExFn = (i: number) =>
  CPX + i * (IW / BREADTH_ELECTIVES.length) + (IW / BREADTH_ELECTIVES.length - EZ_CARD_W) / 2;
const mathEx = () => (TOTAL_W - EZ_CARD_W) / 2;

// Semester plan — 8 semesters, courses listed top-to-bottom within each
const SEMESTER_PLAN = [
  { label: "Year 1", sub: "Fall",   courses: ["ENGL 1310", "MATH 1710", "CSCE 1010"] },
  { label: "Year 1", sub: "Spring", courses: ["ENGL 1320", "CSCE 1015", "CSCE 1030"] },
  { label: "Year 2", sub: "Fall",   courses: ["CSCE 1040", "MATH 1720", "EENG 2710"] },
  { label: "Year 2", sub: "Spring", courses: ["CSCE 2100", "CSCE 2110", "MATH 1780", "TECM 2700"] },
  { label: "Year 3", sub: "Fall",   courses: ["CSCE 2610", "CSCE 3550", "CSCE 3600", "MATH 2700"] },
  { label: "Year 3", sub: "Spring", courses: ["CSCE 3444", "CSCE 4110"] },
  { label: "Year 4", sub: "Fall",   courses: ["CSCE 4010", "CSCE 4901"] },
  { label: "Year 4", sub: "Spring", courses: ["CSCE 4902"] },
] as const;

// ── Position map ────────────────────────────────────────────────────────────
type Pos = { lx: number; rx: number; cx: number; top: number; bot: number; cy: number };

function buildPosMap(): Map<string, Pos> {
  const m = new Map<string, Pos>();

  SEMESTER_PLAN.forEach((sem, col) => {
    (sem.courses as readonly string[]).forEach((code, row) => {
      m.set(code, {
        lx: cardLx(col), rx: cardRx(col), cx: cardCx(col),
        top: cardTopY(row), bot: cardBotY(row), cy: cardCy(row),
      });
    });
  });

  CORE_ELECTIVES.forEach((code, i) => {
    const x = coreExFn(i);
    m.set(code, { lx: x, rx: x + EZ_CARD_W, cx: x + EZ_CARD_W / 2, top: CORE_CARDS_Y, bot: CORE_CARDS_Y + EZ_CARD_H, cy: CORE_CARDS_Y + EZ_CARD_H / 2 });
  });

  BREADTH_ELECTIVES.forEach((code, i) => {
    const x = breadthExFn(i);
    m.set(code, { lx: x, rx: x + EZ_CARD_W, cx: x + EZ_CARD_W / 2, top: BREADTH_CARDS_Y, bot: BREADTH_CARDS_Y + EZ_CARD_H, cy: BREADTH_CARDS_Y + EZ_CARD_H / 2 });
  });

  const mx = mathEx();
  m.set(MATH_ELECTIVE, { lx: mx, rx: mx + EZ_CARD_W, cx: mx + EZ_CARD_W / 2, top: MATH_CARDS_Y, bot: MATH_CARDS_Y + EZ_CARD_H, cy: MATH_CARDS_Y + EZ_CARD_H / 2 });

  return m;
}

// ── Arrow paths ─────────────────────────────────────────────────────────────
interface Arrow { path: string; color: string; opacity: number; dept: string }

const DEPT_COLORS: Record<string, string> = {
  CSCE: "#2fffd0",
  MATH: "#60a5fa",
  EENG: "#fbbf24",
  ENGL: "#f97316",
  TECM: "#f97316",
};

function buildArrows(posMap: Map<string, Pos>): Arrow[] {
  const arrows: Arrow[] = [];

  for (const course of catalog.courses) {
    const target = posMap.get(course.code);
    if (!target) continue;

    for (const prereqCode of course.prerequisites) {
      const source = posMap.get(prereqCode);
      if (!source) continue;

      const dept = prereqCode.split(" ")[0];
      const color = DEPT_COLORS[dept] ?? "rgba(255,255,255,0.3)";
      const isToElective = target.top >= EZ_Y;

      let path: string;

      if (isToElective) {
        // Vertical S-curve from bottom of source → top of target
        const x1 = source.cx;
        const y1 = source.bot + 3;
        const x2 = target.cx;
        const y2 = target.top - 3;
        const my = y1 + (y2 - y1) * 0.5;
        path = `M ${x1} ${y1} C ${x1} ${my} ${x2} ${my} ${x2} ${y2}`;
      } else {
        // Horizontal bezier from right of source → left of target
        const x1 = source.rx + 2;
        const y1 = source.cy;
        const x2 = target.lx - 2;
        const y2 = target.cy;
        const dx = x2 - x1;
        const cp = Math.max(Math.abs(dx) * 0.42, 22);
        path = `M ${x1} ${y1} C ${x1 + cp} ${y1} ${x2 - cp} ${y2} ${x2} ${y2}`;
      }

      const dist = Math.hypot(target.cx - source.cx, target.cy - source.cy);
      const opacity = isToElective ? 0.35
        : dist > 700 ? 0.3
        : dist > 350 ? 0.52
        : 0.72;

      arrows.push({ path, color, opacity, dept });
    }
  }

  return arrows;
}

// ── Card component ───────────────────────────────────────────────────────────
const CARD_BORDER: Record<CourseStatus, string> = {
  completed: "border-emerald-400/50 bg-gradient-to-b from-emerald-400/20 to-transparent",
  available: "border-[#2fffd0]/50 bg-gradient-to-b from-[#2fffd0]/15 to-transparent",
  locked:    "border-white/12 bg-gradient-to-b from-white/[0.04] to-transparent",
};
const CODE_CLS: Record<CourseStatus, string> = {
  completed: "text-emerald-300",
  available: "text-[#2fffd0]",
  locked:    "text-white/60",
};
const TITLE_CLS: Record<CourseStatus, string> = {
  completed: "text-white/65",
  available: "text-white/55",
  locked:    "text-white/28",
};
const BADGE_CLS: Record<CourseStatus, string> = {
  completed: "bg-emerald-400 text-black",
  available: "bg-[#2fffd0] text-black",
  locked:    "bg-white/15 text-white/45",
};

function RoadmapCard({ code, title, credits, status, isElective }: {
  code: string; title: string; credits: number;
  status: CourseStatus; isElective: boolean;
}) {
  return (
    <div className={`h-full w-full rounded-xl border-2 px-3 py-2 ${CARD_BORDER[status]}`}>
      <div className="flex items-start justify-between gap-1">
        <span className={`font-mono text-[11px] font-bold leading-tight ${CODE_CLS[status]}`}>
          {code}
        </span>
        <div className="flex shrink-0 items-center gap-1">
          {isElective && (
            <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-1.5 py-0.5 text-[7px] font-bold leading-none text-violet-300">
              OPT
            </span>
          )}
          <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold leading-none ${BADGE_CLS[status]}`}>
            {credits}cr
          </span>
        </div>
      </div>
      <p className={`mt-1 line-clamp-2 text-[9px] leading-tight ${TITLE_CLS[status]}`}>
        {title}
      </p>
    </div>
  );
}

// ── Elective section header ──────────────────────────────────────────────────
function ElecHeader({ label, note, accent, topY }: {
  label: string; note: string; accent: string; topY: number;
}) {
  return (
    <div
      className="absolute flex items-center gap-2"
      style={{ left: CPX, top: topY, width: IW, height: EZ_HEAD_H }}
    >
      <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: accent }}>
        {label}
      </span>
      <span className="text-[10px] text-white/30">{note}</span>
      <div className="h-px flex-1" style={{ background: `${accent}30` }} />
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
interface Props { completedCodes: string[]; availableCodes: string[] }

const courseInfoMap = new Map(catalog.courses.map(c => [c.code, c]));

export function CourseRoadmapDiagram({ completedCodes, availableCodes }: Props) {
  const uid = useId().replace(/:/g, "");
  const completedSet = useMemo(() => new Set(completedCodes), [completedCodes]);
  const availableSet = useMemo(() => new Set(availableCodes), [availableCodes]);
  const posMap = useMemo(() => buildPosMap(), []);
  const arrows = useMemo(() => buildArrows(posMap), [posMap]);

  const status = (code: string): CourseStatus =>
    completedSet.has(code) ? "completed" : availableSet.has(code) ? "available" : "locked";

  const cardInfo = (code: string) => {
    const c = courseInfoMap.get(code);
    return { title: c?.title ?? code, credits: c?.credits ?? 0 };
  };

  const markerId = (dept: string) => `${uid}-arh-${dept}`;

  return (
    <div className="overflow-x-auto overflow-y-auto rounded-2xl border border-white/12 bg-[#0a0a0a]">
      <div className="relative" style={{ width: TOTAL_W, height: TOTAL_H }}>

        {/* ── SVG arrows ── */}
        <svg
          className="pointer-events-none absolute inset-0"
          width={TOTAL_W}
          height={TOTAL_H}
          viewBox={`0 0 ${TOTAL_W} ${TOTAL_H}`}
        >
          <defs>
            {Object.entries(DEPT_COLORS).map(([dept, color]) => (
              <marker
                key={dept}
                id={markerId(dept)}
                markerWidth="7"
                markerHeight="7"
                refX="5"
                refY="3.5"
                orient="auto"
              >
                <path d="M 0 0 L 6 3.5 L 0 7 Z" fill={color} />
              </marker>
            ))}
          </defs>

          {arrows.map((a, i) => (
            <path
              key={i}
              d={a.path}
              stroke={a.color}
              strokeWidth={1.6}
              strokeOpacity={a.opacity}
              fill="none"
              markerEnd={`url(#${markerId(a.dept)})`}
            />
          ))}
        </svg>

        {/* ── Semester columns ── */}
        {SEMESTER_PLAN.map((sem, col) => (
          <div key={col}>
            {/* Column header */}
            <div
              className="absolute flex flex-col justify-center rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2"
              style={{ left: colX(col), top: CPY, width: COL_W, height: HEAD_H }}
            >
              <p className="text-[8px] font-bold uppercase tracking-widest text-white/30">
                {sem.label}
              </p>
              <p className="text-sm font-bold text-white">{sem.sub}</p>
            </div>

            {/* Course cards */}
            {(sem.courses as readonly string[]).map((code, row) => {
              const { title, credits } = cardInfo(code);
              return (
                <div
                  key={code}
                  className="absolute"
                  style={{ left: cardLx(col), top: cardTopY(row), width: CARD_W, height: CARD_H }}
                >
                  <RoadmapCard
                    code={code}
                    title={title}
                    credits={credits}
                    status={status(code)}
                    isElective={false}
                  />
                </div>
              );
            })}
          </div>
        ))}

        {/* ── Divider between main flow and elective zone ── */}
        <div
          className="absolute left-0 right-0 border-t border-dashed border-white/10"
          style={{ top: EZ_Y - EZ_TOP_GAP / 2 }}
        />
        <div
          className="absolute text-[9px] font-bold uppercase tracking-widest text-white/20"
          style={{ left: CPX, top: EZ_Y - EZ_TOP_GAP / 2 - 16 }}
        >
          Elective Options
        </div>

        {/* ── Core Electives ── */}
        <ElecHeader
          label="CSCE Core Electives"
          note="— Choose 2 of 5"
          accent="#a78bfa"
          topY={CORE_SECTION_Y}
        />
        {CORE_ELECTIVES.map((code, i) => {
          const { title, credits } = cardInfo(code);
          return (
            <div
              key={code}
              className="absolute"
              style={{ left: coreExFn(i), top: CORE_CARDS_Y, width: EZ_CARD_W, height: EZ_CARD_H }}
            >
              <RoadmapCard code={code} title={title} credits={credits} status={status(code)} isElective />
            </div>
          );
        })}

        {/* ── Breadth Electives ── */}
        <ElecHeader
          label="CSCE Breadth Electives"
          note="— Choose 2 of 7"
          accent="#60a5fa"
          topY={BREADTH_SECTION_Y}
        />
        {BREADTH_ELECTIVES.map((code, i) => {
          const { title, credits } = cardInfo(code);
          return (
            <div
              key={code}
              className="absolute"
              style={{ left: breadthExFn(i), top: BREADTH_CARDS_Y, width: EZ_CARD_W, height: EZ_CARD_H }}
            >
              <RoadmapCard code={code} title={title} credits={credits} status={status(code)} isElective />
            </div>
          );
        })}

        {/* ── Math Elective ── */}
        <ElecHeader
          label="Mathematics Elective"
          note="— 3 credit hours"
          accent="#34d399"
          topY={MATH_SECTION_Y}
        />
        {(() => {
          const { title, credits } = cardInfo(MATH_ELECTIVE);
          return (
            <div
              className="absolute"
              style={{ left: mathEx(), top: MATH_CARDS_Y, width: EZ_CARD_W, height: EZ_CARD_H }}
            >
              <RoadmapCard
                code={MATH_ELECTIVE}
                title={title}
                credits={credits}
                status={status(MATH_ELECTIVE)}
                isElective
              />
            </div>
          );
        })()}
      </div>
    </div>
  );
}
