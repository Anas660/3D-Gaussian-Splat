"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useStore } from "@/lib/store";
import { kiriAPI } from "@/lib/kiri-api";

interface CreateModalProps {
  onClose: () => void;
}

export default function CreateModal({ onClose }: CreateModalProps) {
  const { addCapture, updateCapture } = useStore();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setIsUploading(true);
      setError(null);

      try {
        // Upload file to server
        setUploadProgress(30);
        const filePath = await kiriAPI.uploadFile(file);

        // Create a new capture entry
        const captureId = `capture-${Date.now()}`;
        const fileUrl = `${window.location.origin}${filePath}`;

        addCapture({
          id: captureId,
          title: file.name.replace(/\.[^/.]+$/, ""),
          thumbnail: filePath, // Use the file itself as thumbnail for now
          status: "Processing",
          createdAt: new Date().toISOString(),
          progress: 40,
        });

        // Create KIRI task
        setUploadProgress(60);
        const taskId = await kiriAPI.createTask(fileUrl, file.name);
        setUploadProgress(80);

        // Update capture with task ID
        updateCapture(captureId, {
          taskId,
          progress: 80,
        });

        // Poll for task status
        let isComplete = false;
        let pollCount = 0;
        const maxPolls = 1800; // 30 minutes with 1 second intervals

        const pollInterval = setInterval(async () => {
          try {
            pollCount++;
            if (pollCount > maxPolls) {
              clearInterval(pollInterval);
              updateCapture(captureId, { status: "Failed" });
              setError("Task processing timed out");
              return;
            }

            const status = await kiriAPI.getTaskStatus(taskId);

            if (status.status === "completed" || status.status === "success") {
              clearInterval(pollInterval);
              isComplete = true;

              // Extract the model path from output
              const modelPath = status.output?.ply || status.output?.glb || "";

              updateCapture(captureId, {
                status: "Finished",
                progress: 100,
                modelPath,
              });
            } else if (
              status.status === "failed" ||
              status.status === "error"
            ) {
              clearInterval(pollInterval);
              updateCapture(captureId, { status: "Failed" });
              setError(`Processing failed: ${status.status}`);
            } else {
              // Update progress
              const progress = Math.min(99, 80 + (status.progress || 0) * 0.2);
              updateCapture(captureId, { progress });
            }
          } catch (err) {
            console.error("Poll error:", err);
          }
        }, 1000);

        setUploadProgress(100);
        setTimeout(() => {
          onClose();
          setIsUploading(false);
          setUploadProgress(0);
        }, 1000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [addCapture, updateCapture, onClose]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".avi", ".webm"],
      "image/*": [".jpg", ".jpeg", ".png", ".webp"],
    },
    maxSize: 5 * 1024 * 1024 * 1024, // 5GB
    disabled: isUploading,
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Create</h2>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="text-slate-400 hover:text-white text-2xl disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {!isUploading ? (
          <>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-slate-700 hover:border-slate-600"
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-5xl mb-4">☁️</div>
              <p className="text-white font-semibold mb-2">
                Drop a file in this area or click to select
              </p>
              <p className="text-slate-400 text-sm">
                Supports MP4, MOV, AVI, WebM, JPG, PNG (max 5GB)
              </p>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-white font-semibold">
                  Processing your capture...
                </p>
                <p className="text-slate-400 text-sm">{uploadProgress}%</p>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
            <p className="text-slate-400 text-sm text-center">
              This may take a few minutes. You can close this window and monitor
              progress in the dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
