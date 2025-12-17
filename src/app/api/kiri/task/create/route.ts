import { NextRequest, NextResponse } from "next/server";

const KIRI_API_BASE = "https://api.kiriengine.app/api/";
const KIRI_API_KEY = process.env.KIRI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!KIRI_API_KEY) {
      return NextResponse.json(
        { error: "KIRI API key not configured" },
        { status: 500 }
      );
    }

    const { fileUrl, fileName } = await request.json();

    if (!fileUrl || !fileName) {
      return NextResponse.json(
        { error: "Missing fileUrl or fileName" },
        { status: 400 }
      );
    }

    // Create task via KIRI API
    const response = await fetch(`${KIRI_API_BASE}v1/task/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": KIRI_API_KEY,
      },
      body: JSON.stringify({
        name: fileName,
        input: {
          fileUrl,
        },
        // 3DGS Scan task configuration
        taskType: "3d-gaussian-splat-scan",
        config: {
          quality: "high",
          format: "ply",
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("KIRI API error:", errorData);
      throw new Error(`KIRI API error: ${response.status}`);
    }

    const taskData = await response.json();

    return NextResponse.json({
      taskId: taskData.id || taskData.taskId,
      status: taskData.status,
      success: true,
    });
  } catch (error) {
    console.error("Task creation error:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
