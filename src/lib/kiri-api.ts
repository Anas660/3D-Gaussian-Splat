const KIRI_API_BASE =
  process.env.NEXT_PUBLIC_KIRI_API_BASE || "https://api.kiriengine.app/api/";
const KIRI_API_KEY = process.env.KIRI_API_KEY || "";

export interface KiriTask {
  id: string;
  status: string;
  progress?: number;
  output?: {
    ply?: string;
    glb?: string;
  };
}

export const kiriAPI = {
  async createTask(fileUrl: string, fileName: string): Promise<string> {
    const response = await fetch("/api/kiri/task/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileUrl,
        fileName,
      }),
    });

    if (!response.ok) throw new Error("Failed to create KIRI task");
    const data = await response.json();
    return data.taskId;
  },

  async getTaskStatus(taskId: string): Promise<KiriTask> {
    const response = await fetch(`/api/kiri/task/status?taskId=${taskId}`);
    if (!response.ok) throw new Error("Failed to get task status");
    return response.json();
  },

  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to upload file");
    const data = await response.json();
    return data.filePath;
  },
};
