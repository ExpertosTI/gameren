"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ROULETTE_REDS } from "@/lib/logic";
import { FeltTable, GoldMat } from "./assets";

const POCKETS = 37;
const STEP = (Math.PI * 2) / POCKETS;

function pocketColor(n: number) {
  if (n === 0) return "#0d5a3a";
  return ROULETTE_REDS.has(n) ? "#8f1d24" : "#141414";
}

export function WheelWorld({ landed, spinning }: { landed: number; spinning: boolean }) {
  const wheel = useRef<THREE.Group>(null);
  const ball = useRef<THREE.Mesh>(null);
  const vel = useRef(0);
  const ballA = useRef(0);
  const ballR = useRef(1.22);
  const goal = useRef(0);

  const pockets = useMemo(() => Array.from({ length: POCKETS }, (_, i) => i), []);

  useEffect(() => {
    if (!spinning) return;
    vel.current = 9;
    ballR.current = 1.22;
    goal.current = -(landed * STEP) - Math.PI * 6;
  }, [spinning, landed]);

  useFrame((_, dt) => {
    const w = wheel.current;
    const b = ball.current;
    if (!w || !b) return;
    if (spinning || Math.abs(w.rotation.y - goal.current) > 0.02) {
      if (spinning && vel.current > 4) {
        w.rotation.y -= vel.current * dt;
        ballA.current += (vel.current + 3) * dt;
      } else {
        w.rotation.y = THREE.MathUtils.damp(w.rotation.y, goal.current, 3.4, dt);
        ballA.current = THREE.MathUtils.damp(ballA.current, -w.rotation.y + landed * STEP, 4, dt);
        ballR.current = THREE.MathUtils.damp(ballR.current, 0.78, 2.2, dt);
      }
    } else {
      w.rotation.y = goal.current;
      ballR.current = THREE.MathUtils.damp(ballR.current, 0.78, 4, dt);
    }
    b.position.set(Math.cos(ballA.current) * ballR.current, 0.22 + (ballR.current - 0.78) * 0.18, Math.sin(ballA.current) * ballR.current);
  });

  return (
    <group>
      <FeltTable width={3.6} depth={3.6} />
      <mesh position={[0, -0.42, 0]} receiveShadow>
        <cylinderGeometry args={[1.45, 1.5, 0.18, 48]} />
        <GoldMat color="#8d6a2c" />
      </mesh>
      <group ref={wheel} position={[0, -0.22, 0]}>
        {pockets.map((n) => {
          const a = n * STEP;
          return (
            <group key={n} rotation={[0, -a, 0]}>
              <mesh position={[0.92, 0.08, 0]} rotation={[0, 0, 0]} castShadow>
                <boxGeometry args={[0.42, 0.08, 0.16]} />
                <meshStandardMaterial color={pocketColor(n)} roughness={0.45} metalness={0.2} />
              </mesh>
            </group>
          );
        })}
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.42, 0.5, 0.16, 24]} />
          <GoldMat />
        </mesh>
      </group>
      <mesh ref={ball} castShadow>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#f4f0e4" metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.55, 1.38]}>
        <coneGeometry args={[0.06, 0.16, 8]} />
        <GoldMat color="#f3ddaa" />
      </mesh>
    </group>
  );
}
