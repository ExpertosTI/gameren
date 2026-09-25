"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { ChipMesh, FeltTable, GoldMat } from "./assets";

export function LobbyWorld() {
  const rig = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!rig.current) return;
    rig.current.rotation.y = Math.sin(clock.elapsedTime * 0.25) * 0.35;
    rig.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.04;
  });
  return (
    <group ref={rig}>
      <FeltTable width={3.2} depth={2.2} />
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.7, 0.75, 0.12, 32]} />
        <GoldMat />
      </mesh>
      <mesh position={[0, 0.18, 0]} rotation={[0.15, 0, 0]}>
        <torusGeometry args={[0.55, 0.05, 12, 48]} />
        <GoldMat color="#f3ddaa" />
      </mesh>
      <ChipMesh color="#c9a15a" position={[-0.7, -0.54, 0.45]} />
      <ChipMesh color="#8f1d24" position={[-0.55, -0.5, 0.55]} />
      <ChipMesh color="#1d2a4a" position={[0.62, -0.54, 0.4]} />
      <mesh position={[0.7, 0.35, -0.2]} castShadow>
        <octahedronGeometry args={[0.18, 0]} />
        <GoldMat color="#7ecbff" metal={0.75} rough={0.15} />
      </mesh>
    </group>
  );
}
