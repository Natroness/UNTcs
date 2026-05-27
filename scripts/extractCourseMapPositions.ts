#!/usr/bin/env tsx
/**
 * scripts/extractCourseMapPositions.ts
 *
 * Reads public/courseMap.svg (Excalidraw export), finds every <g> element
 * that has a transform="translate(tx ty) rotate(0 cx cy)" attribute, looks at
 * child <text> elements for recognisable course codes, and writes the center
 * position for each found course to lib/generatedCoursePositions.ts.
 *
 * The generated file is the ONLY source of SVG-derived layout data.
 * Prerequisite relationships stay in data/unt-cs-catalog.json.
 *
 * Usage:
 *   npm run extract:course-map
 */

import { XMLParser } from "fast-xml-parser";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ── Path helpers (works in both ESM and CJS) ─────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

const SVG_PATH    = resolve(ROOT, "public/courseMap.svg");
const OUTPUT_PATH = resolve(ROOT, "lib/generatedCoursePositions.ts");

// ReactFlow node size — must match CourseNode.tsx
const NODE_W = 168;
const NODE_H = 74;

// ── Guards ────────────────────────────────────────────────────────────────────
if (!existsSync(SVG_PATH)) {
  console.error(`[extract] ERROR: SVG not found at ${SVG_PATH}`);
  process.exit(1);
}

// ── Normaliser (inline — avoids module resolution issues in tsx) ──────────────
function normaliseCourseCode(raw: string): string | null {
  const cleaned = raw.trim().replace(/[\-_.]/g, " ").replace(/\s+/g, " ").toUpperCase();
  const m = cleaned.replace(/\s+/g, "").match(/^([A-Z]{2,5})(\d{3,4}[A-Z]?)$/);
  if (!m) return null;
  return `${m[1]} ${m[2]}`;
}

// ── Parse transform attribute ─────────────────────────────────────────────────
interface Transform { tx: number; ty: number; cx: number; cy: number }

function parseTransform(attr: string): Transform | null {
  // translate(tx ty) — mandatory
  const transM = attr.match(/translate\(\s*([\d.+-]+)[,\s]+([\d.+-]+)\s*\)/);
  if (!transM) return null;
  const tx = parseFloat(transM[1]);
  const ty = parseFloat(transM[2]);
  if (!isFinite(tx) || !isFinite(ty)) return null;

  // rotate(angle cx cy) — optional; when angle is 0 the cx/cy is the centre
  const rotM = attr.match(/rotate\(\s*[\d.+-]+[,\s]+([\d.+-]+)[,\s]+([\d.+-]+)\s*\)/);
  const cx = rotM ? parseFloat(rotM[1]) : 0;
  const cy = rotM ? parseFloat(rotM[2]) : 0;

  return { tx, ty, cx: isFinite(cx) ? cx : 0, cy: isFinite(cy) ? cy : 0 };
}

// ── Recursive tree walker ─────────────────────────────────────────────────────
type AnyNode = Record<string, unknown>;

const COURSE_CODE_RE = /\b([A-Za-z]{3,4})\s?(\d{4})\b/;

/** Collect all text strings inside a node (handles tspan nesting). */
function collectText(node: AnyNode): string[] {
  const out: string[] = [];
  // raw text value
  if (typeof node["#text"] === "string") out.push(node["#text"]);
  if (typeof node["#text"] === "number") out.push(String(node["#text"]));
  // tspan children
  for (const child of forceArray(node["tspan"])) out.push(...collectText(child as AnyNode));
  return out;
}

function forceArray(v: unknown): unknown[] {
  if (v === undefined || v === null) return [];
  return Array.isArray(v) ? v : [v];
}

/** The accumulated result: courseCode → { x, y } in ReactFlow top-left coords */
const positions: Map<string, { x: number; y: number }> = new Map();
const duplicates: string[] = [];

/** Walk the entire parsed SVG tree. */
function walk(node: AnyNode, parentTransform: Transform | null = null): void {
  // ── <g> — might carry a transform and contain text children ──────────────
  for (const g of forceArray(node["g"])) {
    const gNode = g as AnyNode;
    const transformAttr = (gNode["@_transform"] as string | undefined) ?? "";
    const ownTransform = transformAttr ? parseTransform(transformAttr) : null;
    // Use this g's transform if it has one, otherwise inherit parent's
    const activeTransform = ownTransform ?? parentTransform;

    // Collect course codes from direct <text> children
    if (activeTransform) {
      for (const t of forceArray(gNode["text"])) {
        const textNode = t as AnyNode;
        const strings = collectText(textNode).join(" ");
        const m = strings.match(COURSE_CODE_RE);
        if (m) {
          const raw = `${m[1]} ${m[2]}`;
          const code = normaliseCourseCode(raw);
          if (code) {
            const { tx, ty, cx, cy } = activeTransform;
            // Centre in SVG space → ReactFlow top-left
            const rfX = Math.round(tx + cx - NODE_W / 2);
            const rfY = Math.round(ty + cy - NODE_H / 2);
            if (positions.has(code)) {
              duplicates.push(code);
              console.warn(`[extract] Warning: duplicate label "${code}". Using first occurrence.`);
            } else {
              positions.set(code, { x: rfX, y: rfY });
            }
          }
        }
      }
    }

    // Recurse into nested <g> elements
    walk(gNode, activeTransform ?? parentTransform);
  }
}

// ── Run ───────────────────────────────────────────────────────────────────────
console.log(`[extract] Reading ${SVG_PATH}`);
const svgRaw = readFileSync(SVG_PATH, "utf-8");

// Validate that the SVG contains text nodes (not just outlines)
if (!svgRaw.includes("<text")) {
  console.error(
    "[extract] ERROR: No <text> elements found in SVG. " +
    "Make sure course codes are exported as text, not outlines."
  );
  process.exit(1);
}

const parser = new XMLParser({
  ignoreAttributes:    false,
  attributeNamePrefix: "@_",
  textNodeName:        "#text",
  isArray: (name) =>
    ["g", "text", "tspan", "path", "mask", "clipPath", "defs"].includes(name),
  parseAttributeValue: false,
  allowBooleanAttributes: true,
});

const parsed = parser.parse(svgRaw) as AnyNode;
const xmlWrapper = parsed["?xml"] as AnyNode | undefined;
const svgNode = (parsed["svg"] ?? xmlWrapper?.["svg"] ?? parsed) as AnyNode;

walk(svgNode);

if (positions.size === 0) {
  console.error(
    "[extract] ERROR: No course labels found in SVG. " +
    "Make sure course codes are exported as text, not outlines."
  );
  process.exit(1);
}

// ── Write output ──────────────────────────────────────────────────────────────
const entries = [...positions.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([code, pos]) => `  "${code}": { x: ${pos.x}, y: ${pos.y} },`)
  .join("\n");

const output = `// AUTO-GENERATED by scripts/extractCourseMapPositions.ts
// Source: public/courseMap.svg  (Excalidraw handmade layout)
// DO NOT EDIT manually — re-run: npm run extract:course-map
//
// Coordinates are ReactFlow top-left positions derived from the SVG centre:
//   rfX = svgCenterX - ${NODE_W / 2}   (NODE_W=${NODE_W})
//   rfY = svgCenterY - ${NODE_H / 2}   (NODE_H=${NODE_H})

export interface CoursePosition {
  x: number;
  y: number;
}

export const GENERATED_COURSE_POSITIONS: Record<string, CoursePosition> = {
${entries}
};
`;

writeFileSync(OUTPUT_PATH, output, "utf-8");
console.log(`[extract] Wrote ${positions.size} positions to ${OUTPUT_PATH}`);
if (duplicates.length > 0) {
  console.warn(`[extract] Duplicates found (first occurrence used): ${[...new Set(duplicates)].join(", ")}`);
}
console.log("[extract] Done.");
