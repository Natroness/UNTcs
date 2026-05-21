import { NextResponse } from "next/server";
import { catalog } from "@/lib/catalog";
import { runAudit } from "@/lib/audit";

export const runtime = "nodejs";

interface AuditRequestBody {
  completedCourses?: unknown;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

export async function POST(request: Request) {
  let body: AuditRequestBody;
  try {
    body = (await request.json()) as AuditRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Request body must be a JSON object." },
      { status: 400 },
    );
  }

  if (!isStringArray(body.completedCourses)) {
    return NextResponse.json(
      { error: "`completedCourses` must be an array of strings." },
      { status: 400 },
    );
  }

  const result = runAudit(catalog, body.completedCourses);
  return NextResponse.json(result, { status: 200 });
}

export async function GET() {
  return NextResponse.json(
    { error: "Use POST with { completedCourses: string[] }." },
    { status: 405 },
  );
}
