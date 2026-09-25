"use client";

import type { Card } from "@/lib/logic";
import { CardsWorld } from "./CardsScene";
import { Stage } from "./Stage";

export default function CardsView({
  player,
  dealer,
  hideHole,
}: {
  player: Card[];
  dealer: Card[];
  hideHole: boolean;
}) {
  return (
    <Stage className="h-72" camera={[0, 2.6, 3.4]}>
      <CardsWorld player={player} dealer={dealer} hideHole={hideHole} />
    </Stage>
  );
}
