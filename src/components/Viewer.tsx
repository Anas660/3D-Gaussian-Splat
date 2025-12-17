"use client";

import { useEffect, useRef, useState } from "react";
import { useStore, Capture } from "@/lib/store";
import * as THREE from "three";

interface ViewerProps {
  captureId: string;
}

export default function Viewer({ captureId }: ViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const { captures } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  const capture = captures.find((c) => c.id === captureId);

  useEffect(() => {
    if (!containerRef.current || !capture?.modelPath) return;

    setIsLoading(true);

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 1);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Load PLY file as point cloud (simplified 3D visualization)
    const loadPLY = async () => {
      try {
        if (!capture.modelPath) {
          console.error("No model path available");
          setIsLoading(false);
          return;
        }

        const response = await fetch(capture.modelPath);
        if (!response.ok) throw new Error("Failed to load model");

        const arrayBuffer = await response.arrayBuffer();
        const geometry = parsePLY(arrayBuffer);

        const material = new THREE.PointsMaterial({
          size: 0.005,
          vertexColors: true,
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // Auto-fit camera to model
        const bbox = new THREE.Box3().setFromObject(points);
        const size = bbox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraZ *= 1.5;

        camera.position.z = cameraZ;
        camera.lookAt(bbox.getCenter(new THREE.Vector3()));

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load PLY:", error);
        setIsLoading(false);
      }
    };

    loadPLY();

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    const rotation = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !sceneRef.current) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      rotation.y += deltaX * 0.005;
      rotation.x += deltaY * 0.005;

      if (sceneRef.current.children[0]) {
        sceneRef.current.children[0].rotation.x = rotation.x;
        sceneRef.current.children[0].rotation.y = rotation.y;
      }

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onMouseWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (cameraRef.current) {
        cameraRef.current.position.z += e.deltaY * 0.01;
        cameraRef.current.position.z = Math.max(
          0.1,
          Math.min(100, cameraRef.current.position.z)
        );
      }
    };

    renderer.domElement.addEventListener("mousedown", onMouseDown);
    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("wheel", onMouseWheel, {
      passive: false,
    });

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("mouseup", onMouseUp);
      renderer.domElement.removeEventListener("wheel", onMouseWheel);
      if (
        containerRef.current &&
        renderer.domElement.parentNode === containerRef.current
      ) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [capture?.modelPath]);

  const downloadModel = () => {
    if (!capture?.modelPath) return;
    const link = document.createElement("a");
    link.href = capture.modelPath;
    link.download = `${capture.title}.ply`;
    link.click();
  };

  if (!capture) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Capture not found</p>
      </div>
    );
  }

  if (capture.status !== "Finished") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-2">
            {capture.status === "Processing"
              ? "Processing your capture..."
              : "Failed to process capture"}
          </p>
          <p className="text-slate-400">
            {capture.status === "Processing" &&
              capture.progress &&
              `${Math.round(capture.progress)}%`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden">
      {/* Canvas Container */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">◐</div>
            <p className="text-white">Loading 3D model...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-6 z-20 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          <div>
            <h1 className="text-white text-2xl font-bold">{capture.title}</h1>
            <p className="text-slate-300 text-sm mt-1">
              {new Date(capture.createdAt).toLocaleString()}
            </p>
          </div>
          <a
            href="/"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            ← Back
          </a>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6 z-20 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          <div className="text-slate-300 text-sm">
            <p>🖱️ Drag to rotate • 🔍 Scroll to zoom</p>
          </div>
          <button
            onClick={downloadModel}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold flex items-center gap-2"
          >
            ⬇️ Download PLY
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function to parse PLY file
function parsePLY(arrayBuffer: ArrayBuffer) {
  const geometry = new THREE.BufferGeometry();
  const view = new Uint8Array(arrayBuffer);
  const text = new TextDecoder().decode(view.slice(0, 2048));
  const lines = text.split("\n");

  let vertexCount = 0;
  let headerEnd = 0;
  const properties: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("element vertex")) {
      vertexCount = parseInt(lines[i].split(" ")[2]);
    }
    if (lines[i].startsWith("property")) {
      properties.push(lines[i].split(" ")[1]);
    }
    if (lines[i] === "end_header") {
      headerEnd = text.indexOf(lines[i]) + "end_header".length + 1;
      break;
    }
  }

  const positions: number[] = [];
  const colors: number[] = [];
  const dataStart = new TextEncoder().encode(text.slice(0, headerEnd)).length;

  // Simple PLY parser (assumes float x,y,z and uchar r,g,b)
  const bytesPerVertex = 12 + (properties.includes("red") ? 3 : 0);
  const floatView = new DataView(arrayBuffer, dataStart);

  for (let i = 0; i < Math.min(vertexCount, 1000000); i++) {
    const offset = i * bytesPerVertex;
    // X, Y, Z (little-endian floats)
    positions.push(floatView.getFloat32(offset, true));
    positions.push(floatView.getFloat32(offset + 4, true));
    positions.push(floatView.getFloat32(offset + 8, true));

    // RGB (if available)
    if (properties.includes("red")) {
      colors.push(view[dataStart + offset + 12] / 255);
      colors.push(view[dataStart + offset + 13] / 255);
      colors.push(view[dataStart + offset + 14] / 255);
    }
  }

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3)
  );
  if (colors.length > 0) {
    geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(colors), 3)
    );
  }

  return geometry;
}
