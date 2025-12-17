"use client";

import Link from "next/link";
import { Capture } from "@/lib/store";

interface CaptureGridProps {
  captures: Capture[];
}

export default function CaptureGrid({ captures }: CaptureGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {captures.map((capture) => (
        <Link
          key={capture.id}
          href={capture.status === "Finished" ? `/viewer/${capture.id}` : "#"}
          className="group cursor-pointer"
        >
          <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-800 border border-slate-700 hover:border-blue-500 transition-all duration-300">
            {/* Thumbnail */}
            <img
              src={capture.thumbnail}
              alt={capture.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
              <p className="text-white text-sm font-semibold truncate">
                {capture.title}
              </p>
              <p className="text-slate-300 text-xs mt-1">
                {new Date(capture.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Status Badge */}
            <div className="absolute top-2 right-2">
              <div
                className={`px-2 py-1 rounded text-xs font-semibold text-white ${
                  capture.status === "Finished"
                    ? "bg-green-600"
                    : capture.status === "Processing"
                    ? "bg-blue-600"
                    : "bg-red-600"
                }`}
              >
                {capture.status === "Processing" && (
                  <span className="inline-block animate-spin mr-1">⟳</span>
                )}
                {capture.status}
              </div>
            </div>

            {/* Progress Bar */}
            {capture.status === "Processing" &&
              capture.progress !== undefined && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${capture.progress}%` }}
                  />
                </div>
              )}
          </div>
        </Link>
      ))}
    </div>
  );
}
