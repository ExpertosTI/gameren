"use client";

import { Stage } from "./Stage";
import { LobbyWorld } from "./LobbyScene";

export default function LobbyView() {
  return (
    <Stage className="h-48" camera={[0, 1.5, 3.6]}>
      <LobbyWorld />
    </Stage>
  );
}
