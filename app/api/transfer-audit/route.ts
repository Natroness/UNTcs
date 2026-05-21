import { NextResponse } from "next/server";
import { parseUntAuditText } from "@/lib/untAuditParser";
import { catalog } from "@/lib/catalog";
import type { TransferAuditApiResult } from "@/types/course";

export const runtime = "nodejs";

interface TransferAuditRequestBody {
  text?: unknown;
}

export async function POST(request: Request) {
  let body: TransferAuditRequestBody;
  try {
    body = (await request.json()) as TransferAuditRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object" || typeof body.text !== "string") {
    return NextResponse.json(
      { error: "`text` (string) is required." },
      { status: 400 },
    );
  }

  if (body.text.trim().length === 0) {
    return NextResponse.json(
      { error: "Paste the UNT degree audit text. Empty input cannot be parsed." },
      { status: 400 },
    );
  }

  const parsed = parseUntAuditText(body.text);

  const catalogCodes = new Set(catalog.courses.map((c) => c.code));
  const matchedCatalogCourses = parsed.completedCourses.filter((c) => catalogCodes.has(c));
  const unknownCourses = parsed.completedCourses.filter((c) => !catalogCodes.has(c));
  const transferCount = parsed.completed.filter((c) => c.source === "TRANSFER").length;

  const payload: TransferAuditApiResult = {
    ...parsed,
    matchedCatalogCourses,
    unknownCourses,
    summary: {
      completedCount: parsed.completedCourses.length,
      remainingCount: parsed.remainingCourses.length,
      matchedCount: matchedCatalogCourses.length,
      unknownCount: unknownCourses.length,
      transferCount,
    },
  };

  return NextResponse.json(payload, { status: 200 });
}

export async function GET() {
  return NextResponse.json(
    { error: "Use POST with { text: string }." },
    { status: 405 },
  );
}
