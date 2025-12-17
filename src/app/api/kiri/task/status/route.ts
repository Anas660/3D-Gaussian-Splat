import { NextRequest, NextResponse } from "next/server";

const KIRI_API_BASE = "https://api.kiriengine.app/api/";
const KIRI_API_KEY = process.env.KIRI_API_KEY;

export async function GET(request: NextRequest) {
  try {
    const taskId = request.nextUrl.searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json({ error: "Missing taskId" }, { status: 400 });
    }

    if (!KIRI_API_KEY) {
      return NextResponse.json(
        { error: "KIRI API key not configured" },
        { status: 500 }
      );
    }

    // Get task status from KIRI API
    const response = await fetch(`${KIRI_API_BASE}v1/task/${taskId}`, {
      method: "GET",
      headers: {
        "x-api-key": KIRI_API_KEY,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }
      throw new Error(`KIRI API error: ${response.status}`);
    }

    const taskData = await response.json();

    return NextResponse.json({
      id: taskData.id,
      status: taskData.status,
      progress: taskData.progress || 0,
      output: taskData.output || null,
      error: taskData.error || null,
    });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: "Failed to get task status" },
      { status: 500 }
    );
  }
}
