"use client";

import { useState, useEffect } from "react";
import { useStore, Capture } from "@/lib/store";
import CaptureGrid from "./CaptureGrid";
import CreateModal from "./CreateModal";

export default function Dashboard() {
  const { captures, setCaptures } = useStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load captures from localStorage
    const saved = localStorage.getItem("captures");
    if (saved) {
      setCaptures(JSON.parse(saved));
    }
  }, [setCaptures]);

  // Save captures to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("captures", JSON.stringify(captures));
  }, [captures]);

  const filteredCaptures = captures.filter((capture) =>
    capture.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">
                Fields Dashboard
              </h1>
              <p className="text-slate-400 mt-1">
                3D Gaussian Splats Processing
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              + Create
            </button>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-slate-900/30 border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <input
            type="text"
            placeholder="Search for your capture..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Gallery */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {filteredCaptures.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">
              {searchQuery
                ? "No captures found matching your search."
                : 'No captures yet. Click "Create" to get started!'}
            </p>
          </div>
        ) : (
          <CaptureGrid captures={filteredCaptures} />
        )}
      </main>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <CreateModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </div>
  );
}
