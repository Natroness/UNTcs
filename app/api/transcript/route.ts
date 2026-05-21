import { NextResponse } from "next/server";
import { parseTranscript } from "@/lib/transcriptParser";

export const runtime = "nodejs";

interface TranscriptRequestBody {
  text?: unknown;
}

export async function POST(request: Request) {
  let body: TranscriptRequestBody;
  try {
    body = (await request.json()) as TranscriptRequestBody;
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

  const courses = parseTranscript(body.text);
  return NextResponse.json({ courses }, { status: 200 });
}

export async function GET() {
  return NextResponse.json(
    { error: "Use POST with { text: string }." },
    { status: 405 },
  );
}
