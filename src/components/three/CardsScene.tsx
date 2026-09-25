"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { Card } from "@/lib/logic";
import { ChipMesh, FeltTable, PlayingCard } from "./assets";

function FlyCard({
  card,
  hidden,
  to,
}: {
  card?: Card;
  hidden?: boolean;
  to: [number, number, number];
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    g.position.x = THREE.MathUtils.damp(g.position.x, to[0], 6, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, to[1], 6, dt);
    g.position.z = THREE.MathUtils.damp(g.position.z, to[2], 6, dt);
    const flip = hidden ? Math.PI : 0;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, flip, 7, dt);
  });
  return (
    <group ref={ref} position={[1.6, 0.5, -0.8]}>
      <PlayingCard card={card} hidden={hidden} position={[0, 0, 0]} />
    </group>
  );
}

export function CardsWorld({
  player,
  dealer,
  hideHole,
}: {
  player: Card[];
  dealer: Card[];
  hideHole: boolean;
}) {
  return (
    <group>
      <FeltTable width={4.6} depth={2.8} />
      <ChipMesh color="#c9a15a" position={[-1.6, -0.54, 0.7]} />
      <ChipMesh color="#8f1d24" position={[-1.42, -0.5, 0.78]} />
      <ChipMesh color="#1d2a4a" position={[-1.5, -0.46, 0.62]} />
      {dealer.map((c, i) => (
        <FlyCard key={`d${c.rank}${c.suit}${i}`} card={c} hidden={hideHole && i === 1} to={[-0.7 + i * 0.72, -0.18, -0.55]} />
      ))}
      {player.map((c, i) => (
        <FlyCard key={`p${c.rank}${c.suit}${i}`} card={c} hidden={false} to={[-0.7 + i * 0.72, -0.18, 0.62]} />
      ))}
      <mesh position={[1.55, -0.2, -0.75]} rotation={[0.15, 0.4, 0.1]} castShadow>
        <boxGeometry args={[0.62, 0.88, 0.12]} />
        <meshStandardMaterial color="#10182c" metalness={0.4} roughness={0.4} />
      </mesh>
    </group>
  );
}
