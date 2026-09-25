"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { ReelSymbol } from "@/lib/logic";
import { FeltTable, REEL_RADIUS, REEL_STEP, SYMBOLS, SymbolMesh } from "./assets";

function Reel({
  x,
  target,
  spinning,
  delay,
}: {
  x: number;
  target: ReelSymbol;
  spinning: boolean;
  delay: number;
}) {
  const group = useRef<THREE.Group>(null);
  const vel = useRef(0);
  const goal = useRef(0);
  const active = useRef(false);

  useEffect(() => {
    if (!spinning) return;
    active.current = true;
    vel.current = 14 + delay * 2;
    const idx = SYMBOLS.indexOf(target);
    const extra = 6 + delay;
    const start = group.current?.rotation.x ?? 0;
    goal.current = start - extra * Math.PI * 2 - idx * REEL_STEP - ((start % (Math.PI * 2)) + Math.PI * 2);
    const landed = -idx * REEL_STEP;
    goal.current = landed - extra * Math.PI * 2;
    if (group.current) {
      const cur = group.current.rotation.x;
      const turns = extra * Math.PI * 2;
      goal.current = cur - (cur % (Math.PI * 2)) - turns + landed;
    }
  }, [spinning, target, delay]);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    if (spinning || active.current) {
      const dist = goal.current - g.rotation.x;
      if (spinning && vel.current > 8) {
        g.rotation.x -= vel.current * dt;
        return;
      }
      vel.current = THREE.MathUtils.damp(vel.current, 0, 2.2, dt);
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, goal.current, 6, dt);
      if (!spinning && Math.abs(dist) < 0.01) {
        g.rotation.x = goal.current;
        active.current = false;
      }
    }
  });

  return (
    <group ref={group} position={[x, 0.15, 0]}>
      {SYMBOLS.map((s, i) => {
        const a = i * REEL_STEP;
        return (
          <group key={s} position={[0, Math.sin(a) * REEL_RADIUS, Math.cos(a) * REEL_RADIUS]} rotation={[a, 0, 0]}>
            <mesh position={[0, 0, -0.12]}>
              <boxGeometry args={[0.72, 0.62, 0.08]} />
              <meshStandardMaterial color="#12192b" metalness={0.4} roughness={0.45} />
            </mesh>
            <SymbolMesh type={s} />
          </group>
        );
      })}
    </group>
  );
}

export function ReelsWorld({
  result,
  spinning,
}: {
  result: [ReelSymbol, ReelSymbol, ReelSymbol];
  spinning: boolean;
}) {
  return (
    <group>
      <FeltTable width={3.8} depth={2.2} />
      <mesh position={[0, 0.15, -0.35]}>
        <boxGeometry args={[2.7, 1.7, 0.35]} />
        <meshStandardMaterial color="#161c2e" metalness={0.55} roughness={0.35} />
      </mesh>
      {[-0.82, 0, 0.82].map((x) => (
        <mesh key={x} position={[x, 0.15, 0.22]}>
          <boxGeometry args={[0.02, 1.55, 0.9]} />
          <meshStandardMaterial color="#c9a15a" metalness={0.8} roughness={0.25} />
        </mesh>
      ))}
      <Reel x={-0.78} target={result[0]} spinning={spinning} delay={0} />
      <Reel x={0} target={result[1]} spinning={spinning} delay={0.35} />
      <Reel x={0.78} target={result[2]} spinning={spinning} delay={0.7} />
      <mesh position={[0, 1.12, 0.1]}>
        <boxGeometry args={[2.7, 0.16, 0.7]} />
        <meshStandardMaterial color="#d4af6a" metalness={0.85} roughness={0.2} />
      </mesh>
    </group>
  );
}
