"use client";

import { LuckyWheel } from "@lucky-canvas/react";
import { forwardRef, useImperativeHandle, useRef } from "react";

export type PrizeSlice = {
  text: string;
  background: string;
  fontColor: string;
};

export type LuckySpinHandle = { start: () => void };

export const LuckySpin = forwardRef<LuckySpinHandle, {
  prizes: PrizeSlice[];
  hub: string;
  onPick: (index: number) => void;
  spinning: boolean;
  setSpinning: (v: boolean) => void;
  size?: number;
  pickIndex?: () => number;
}>(function LuckySpin({ prizes, hub, onPick, spinning, setSpinning, size = 300, pickIndex }, ref) {
  const wheel = useRef<LuckyWheel | null>(null);

  const run = () => {
    if (spinning || !wheel.current) return;
    const idx = pickIndex ? pickIndex() : Math.floor(Math.random() * prizes.length);
    setSpinning(true);
    wheel.current.play();
    window.setTimeout(() => wheel.current?.stop(idx), 2200);
  };

  useImperativeHandle(ref, () => ({ start: run }));

  return (
    <div className="lucky-wrap" style={{ width: size, height: size }}>
      <LuckyWheel
        ref={wheel}
        width={`${size}px`}
        height={`${size}px`}
        blocks={[
          { padding: "14px", background: "#c9a15a" },
          { padding: "6px", background: "#0b1220" },
        ]}
        prizes={prizes.map((p) => ({
          background: p.background,
          fonts: [{ text: p.text, top: "18%", fontColor: p.fontColor, fontSize: prizes.length > 12 ? "11px" : "15px", fontWeight: "700" }],
        }))}
        buttons={[
          { radius: "38%", background: "#8a6420" },
          { radius: "33%", background: "#f3ddaa" },
          {
            radius: "28%",
            background: "#c9a15a",
            pointer: true,
            fonts: [{ text: hub, top: "-12px", fontColor: "#1b1408", fontSize: "28px", fontWeight: "700" }],
          },
        ]}
        defaultConfig={{
          gutter: "1px",
          speed: 22,
          accelerationTime: 1800,
          decelerationTime: 2800,
        }}
        defaultStyle={{ fontStyle: "Outfit, sans-serif" }}
        onStart={run}
        onEnd={(prize: { fonts?: { text: string }[] }) => {
          setSpinning(false);
          const text = prize?.fonts?.[0]?.text ?? "";
          const idx = prizes.findIndex((p) => p.text === text);
          onPick(idx >= 0 ? idx : 0);
        }}
      />
    </div>
  );
});
