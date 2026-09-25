"use client";

import type { ReelSymbol } from "@/lib/logic";
import { ReelsWorld } from "./ReelsScene";
import { Stage } from "./Stage";

export default function ReelsView({
  result,
  spinning,
}: {
  result: [ReelSymbol, ReelSymbol, ReelSymbol];
  spinning: boolean;
}) {
  return (
    <Stage className="h-72" camera={[0, 0.55, 3.6]}>
      <ReelsWorld result={result} spinning={spinning} />
    </Stage>
  );
}
