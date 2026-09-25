"use client";

import { useRef, useState } from "react";
import { ANIMALS, animalLabel, pickAnimalIndex } from "@/lib/animals";
import { showBanner } from "@/lib/fx";
import { feedJackpot, hitJackpot, readJackpot, writeJackpot } from "@/lib/jackpot";
import { formatChips } from "@/lib/logic";
import { useClub } from "@/lib/store";
import { AnimalWheel } from "./AnimalWheel";
import { JackpotBar } from "./JackpotBar";
import { Chip, Screen } from "./ui";
import type { LuckySpinHandle } from "./LuckySpin";

export function SafariGame() {
  const { tr, profile, playRound, ping } = useClub();
  const spinRef = useRef<LuckySpinHandle>(null);
  const pending = useRef(0);
  const [bet, setBet] = useState(200);
  const [busy, setBusy] = useState(false);
  const [landed, setLanded] = useState<number | null>(null);

  const spin = () => {
    if (busy || bet > profile.chips) return;
    pending.current = pickAnimalIndex();
    ping("spin");
    spinRef.current?.start();
  };

  return (
    <Screen title={tr("safari")} back="home">
      <JackpotBar />
      <p className="text-sm text-[var(--muted)]">{tr("safariHint")}</p>
      <AnimalWheel
        spinRef={spinRef}
        spinning={busy}
        setSpinning={setBusy}
        pickIndex={() => pending.current}
        onPick={(idx) => {
          const animal = ANIMALS[idx] ?? ANIMALS[0];
          setLanded(idx);
          const pot = readJackpot();
          let payout = 0;
          if (animal.jackpot) {
            payout = hitJackpot(pot);
            showBanner({
              kind: "jackpot",
              title: tr("jackpotHit"),
              sub: `G ${formatChips(payout)} · ${animal.emoji} ${animalLabel(animal, profile.locale)}`,
            });
          } else {
            payout = bet * animal.mult;
            writeJackpot(feedJackpot(pot, bet));
            const kind = animal.mult >= 12 ? "big" : payout > bet ? "win" : "lose";
            showBanner({
              kind,
              title: kind === "lose" ? tr("lose") : kind === "big" ? tr("bigWin") : tr("win"),
              sub: `${animal.emoji} ${animalLabel(animal, profile.locale)} · x${animal.mult} · G ${formatChips(payout)}`,
            });
          }
          playRound(bet, payout, "safari", animal.id);
        }}
        hub={landed !== null ? ANIMALS[landed].emoji : "L"}
      />
      <div className="grid grid-cols-4 gap-2">
        {ANIMALS.map((animal) => (
          <div key={animal.id} className="glass rounded-2xl px-2 py-2 text-center">
            <p className="text-xl">{animal.emoji}</p>
            <p className="text-[10px] text-[var(--gold-2)]">{animal.jackpot ? "JP" : `x${animal.mult}`}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-sm">
        <span>
          {tr("bet")}: <Chip n={bet} size="sm" />
        </span>
        <Chip n={profile.chips} size="sm" />
      </div>
      <input type="range" min={50} max={2000} step={50} value={bet} onChange={(e) => setBet(Number(e.target.value))} />
      <button className="btn-gold h-12 w-full rounded-2xl" disabled={busy} onClick={spin}>
        {tr("spin")}
      </button>
    </Screen>
  );
}
