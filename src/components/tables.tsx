"use client";

import { ROULETTE_REDS, type Card, type ReelSymbol } from "@/lib/logic";

const GLYPH: Record<ReelSymbol, string> = {
  star: "✦",
  crown: "♔",
  gem: "◆",
  moon: "☾",
  fox: "▲",
};

const STRIP: ReelSymbol[] = ["star", "crown", "gem", "moon", "fox", "star", "crown", "gem"];

export function ReelWindow({
  face,
  spinning,
  delay,
}: {
  face: ReelSymbol;
  spinning: boolean;
  delay: number;
}) {
  return (
    <div className="reel-col">
      <div
        className={`reel-strip ${spinning ? "reel-spin" : ""}`}
        style={{
          animationDelay: `${delay}s`,
          transform: spinning ? undefined : `translateY(-${STRIP.indexOf(face) * 72}px)`,
        }}
      >
        {STRIP.map((s, i) => (
          <div key={`${s}${i}`} className="reel-cell">
            {GLYPH[s]}
          </div>
        ))}
      </div>
    </div>
  );
}

export function WheelDisk({ n, spinning }: { n: number; spinning: boolean }) {
  const angle = n * (360 / 37);
  return (
    <div className="wheel-stage">
      <div className="wheel-pin" />
      <div className={`wheel-disk ${spinning ? "wheel-spin" : ""}`} style={{ transform: `rotate(${angle}deg)` }}>
        {Array.from({ length: 37 }, (_, i) => (
          <i
            key={i}
            className="wheel-pocket"
            style={{
              transform: `rotate(${i * (360 / 37)}deg)`,
              background: i === 0 ? "#0d5a3a" : ROULETTE_REDS.has(i) ? "#8f1d24" : "#141414",
            }}
          />
        ))}
        <b className="wheel-hub">{n}</b>
      </div>
    </div>
  );
}

const SUIT_FILE = { C: "clubs", D: "diamonds", H: "hearts", S: "spades" } as const;

function kenneyRank(rank: Card["rank"]) {
  if (rank === "10") return "10";
  if (/^[2-9]$/.test(rank)) return `0${rank}`;
  return rank;
}

export function TableCard({ card, hidden }: { card?: Card; hidden?: boolean }) {
  if (!card) return <div className="tcard tcard-empty" />;
  if (hidden) {
    return <img className="tcard-img" src="/assets/kenney/cards/card_back.png" alt="" />;
  }
  const src = `/assets/kenney/cards/card_${SUIT_FILE[card.suit]}_${kenneyRank(card.rank)}.png`;
  return <img className="tcard-img" src={src} alt={`${card.rank}${card.suit}`} />;
}
