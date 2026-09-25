"use client";

import { Canvas } from "@react-three/fiber";
import { type ReactNode, Suspense } from "react";

export function Stage({
  children,
  camera = [0, 1.15, 4.4],
  className = "h-64",
}: {
  children: ReactNode;
  camera?: [number, number, number];
  className?: string;
}) {
  return (
    <div className={`relative w-full overflow-hidden rounded-3xl bg-[#0b1220] ${className}`} style={{ minHeight: 288 }}>
      <Canvas
        camera={{ position: camera, fov: 38, near: 0.1, far: 40 }}
        dpr={[1, 1.6]}
        style={{ width: "100%", height: "100%", display: "block" }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        resize={{ scroll: false, debounce: 0 }}
      >
        <color attach="background" args={["#070b14"]} />
        <fog attach="fog" args={["#070b14", 7, 16]} />
        <hemisphereLight args={["#fff6d8", "#1a2744", 1.4]} />
        <ambientLight intensity={1.1} />
        <directionalLight position={[2.2, 4.2, 3.2]} intensity={3.2} color="#fff3cc" />
        <pointLight position={[-2.2, 2.2, 1.6]} intensity={2.2} color="#8aa4ff" />
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
