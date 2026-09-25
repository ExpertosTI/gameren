"use client";

import { useMemo } from "react";
import * as THREE from "three";
import type { Card, ReelSymbol } from "@/lib/logic";

export const SYMBOLS: ReelSymbol[] = ["star", "crown", "gem", "moon", "fox"];
export const REEL_STEP = (Math.PI * 2) / SYMBOLS.length;
export const REEL_RADIUS = 0.92;

const COLORS: Record<ReelSymbol, string> = {
  star: "#f6e2a8",
  crown: "#e0b25a",
  gem: "#7ecbff",
  moon: "#d7dcff",
  fox: "#ff9b4c",
};

export function GoldMat({ color = "#e8c891", metal = 0.28, rough = 0.42 }) {
  return <meshStandardMaterial color={color} metalness={metal} roughness={rough} emissive={color} emissiveIntensity={0.12} />;
}

export function SymbolMesh({ type }: { type: ReelSymbol }) {
  const color = COLORS[type];
  if (type === "gem") {
    return (
      <mesh castShadow>
        <octahedronGeometry args={[0.28, 0]} />
        <GoldMat color={color} metal={0.7} rough={0.18} />
      </mesh>
    );
  }
  if (type === "star") {
    return (
      <group>
        <mesh castShadow rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.42, 0.42, 0.08]} />
          <GoldMat color={color} />
        </mesh>
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.42, 0.08]} />
          <GoldMat color={color} />
        </mesh>
      </group>
    );
  }
  if (type === "crown") {
    return (
      <group>
        <mesh position={[0, -0.08, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.26, 0.12, 8]} />
          <GoldMat color={color} />
        </mesh>
        {[-0.16, 0, 0.16].map((x) => (
          <mesh key={x} position={[x, 0.08, 0]} castShadow>
            <coneGeometry args={[0.07, 0.18, 6]} />
            <GoldMat color={color} />
          </mesh>
        ))}
      </group>
    );
  }
  if (type === "moon") {
    return (
      <mesh castShadow rotation={[0.4, 0.2, 0]}>
        <sphereGeometry args={[0.24, 18, 18]} />
        <GoldMat color={color} metal={0.35} rough={0.4} />
      </mesh>
    );
  }
  return (
    <mesh castShadow rotation={[0.5, 0.3, 0.1]}>
      <tetrahedronGeometry args={[0.3, 0]} />
      <GoldMat color={color} metal={0.4} rough={0.35} />
    </mesh>
  );
}

export function ChipMesh({ color, position }: { color: string; position: [number, number, number] }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.22, 0.22, 0.05, 24]} />
      <GoldMat color={color} metal={0.55} rough={0.32} />
    </mesh>
  );
}

export function FeltTable({ width = 4.4, depth = 2.6 }: { width?: number; depth?: number }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.62, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#0c2a22" roughness={0.9} metalness={0.05} />
      </mesh>
      <mesh position={[0, -0.7, 0]}>
        <boxGeometry args={[width + 0.28, 0.16, depth + 0.28]} />
        <GoldMat color="#8d6a2c" metal={0.7} />
      </mesh>
    </group>
  );
}

export function cardTexture(card: Card | "back"): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 360;
  const g = c.getContext("2d")!;
  if (card === "back") {
    const grd = g.createLinearGradient(0, 0, 256, 360);
    grd.addColorStop(0, "#10182c");
    grd.addColorStop(1, "#1d2a4a");
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 360);
    g.strokeStyle = "#e8c891";
    g.lineWidth = 10;
    g.strokeRect(14, 14, 228, 332);
    g.fillStyle = "#e8c891";
    g.font = "bold 72px serif";
    g.textAlign = "center";
    g.fillText("L", 128, 200);
    return new THREE.CanvasTexture(c);
  }
  g.fillStyle = "#fff7e8";
  g.fillRect(0, 0, 256, 360);
  const red = card.suit === "H" || card.suit === "D";
  g.fillStyle = red ? "#b4232c" : "#161616";
  const mark = { C: "♣", D: "♦", H: "♥", S: "♠" }[card.suit];
  g.font = "bold 52px serif";
  g.fillText(card.rank, 22, 62);
  g.font = "64px serif";
  g.fillText(mark, 22, 126);
  g.font = "120px serif";
  g.textAlign = "center";
  g.fillText(mark, 128, 230);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function PlayingCard({
  card,
  hidden,
  position,
  rotation = [0, 0, 0],
}: {
  card?: Card;
  hidden?: boolean;
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const front = useMemo(() => (card && !hidden ? cardTexture(card) : cardTexture("back")), [card, hidden]);
  const back = useMemo(() => cardTexture("back"), []);
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[0.62, 0.88, 0.03]} />
        <meshStandardMaterial attach="material-4" map={front} roughness={0.35} />
        <meshStandardMaterial attach="material-5" map={back} roughness={0.4} />
        <meshStandardMaterial attach="material-0" color="#f3e6c8" />
        <meshStandardMaterial attach="material-1" color="#f3e6c8" />
        <meshStandardMaterial attach="material-2" color="#f3e6c8" />
        <meshStandardMaterial attach="material-3" color="#f3e6c8" />
      </mesh>
    </group>
  );
}
