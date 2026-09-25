"use client";

import { useMemo, type Ref } from "react";
import { ANIMALS } from "@/lib/animals";
import { LuckySpin, type LuckySpinHandle } from "./LuckySpin";

export function AnimalWheel({
  spinRef,
  spinning,
  setSpinning,
  onPick,
  pickIndex,
  size = 300,
  hub = "L",
}: {
  spinRef: Ref<LuckySpinHandle>;
  spinning: boolean;
  setSpinning: (v: boolean) => void;
  onPick: (index: number) => void;
  pickIndex?: () => number;
  size?: number;
  hub?: string;
}) {
  const prizes = useMemo(
    () =>
      ANIMALS.map((animal) => ({
        text: `${animal.emoji} ${animal.jackpot ? "JP" : `x${animal.mult}`}`,
        background: animal.color,
        fontColor: animal.text,
      })),
    [],
  );

  return (
    <LuckySpin
      ref={spinRef}
      prizes={prizes}
      hub={hub}
      spinning={spinning}
      setSpinning={setSpinning}
      onPick={onPick}
      pickIndex={pickIndex}
      size={size}
    />
  );
}
