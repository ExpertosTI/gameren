"use client";

import { Stage } from "./Stage";
import { WheelWorld } from "./WheelScene";

export default function WheelView({ landed, spinning }: { landed: number; spinning: boolean }) {
  return (
    <Stage className="h-72" camera={[0, 2.4, 3.1]}>
      <WheelWorld landed={landed} spinning={spinning} />
    </Stage>
  );
}
