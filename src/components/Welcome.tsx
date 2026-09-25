"use client";

import { useEffect, useRef, useState } from "react";
import { ANIMALS } from "@/lib/animals";
import { showBanner } from "@/lib/fx";
import { formatChips } from "@/lib/logic";
import { useClub } from "@/lib/store";
import { AnimalWheel } from "./AnimalWheel";
import type { LuckySpinHandle } from "./LuckySpin";
import { Chip } from "./ui";

export const WELCOME_KEY = "luxa.welcome.g";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function WelcomeGate({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) {
  const { tr, ping } = useClub();
  const spinRef = useRef<LuckySpinHandle>(null);
  const [spinning, setSpinning] = useState(false);
  const [landed, setLanded] = useState<number | null>(null);
  const [left, setLeft] = useState(237);

  useEffect(() => {
    const t = window.setInterval(() => setLeft((s) => (s <= 0 ? 237 : s - 1)), 1000);
    return () => window.clearInterval(t);
  }, []);

  const animal = landed !== null ? ANIMALS[landed] : null;

  return (
    <div className="flex min-h-full flex-col px-5 pb-8 pt-[max(12px,env(safe-area-inset-top))]">
      <header className="flex items-center justify-between">
        <p className="font-[family-name:var(--font-playfair)] text-xl gold-text">LUXA</p>
        <button className="btn-ghost rounded-full px-4 py-2 text-sm" onClick={onLogin}>
          {tr("login")}
        </button>
      </header>

      <div className="mt-6 text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">{tr("gateTag")}</p>
        <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl gold-text">{tr("gateTitle")}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{tr("gateBody")}</p>
      </div>

      <div className="relative mx-auto mt-6 grid place-items-center">
        <AnimalWheel
          spinRef={spinRef}
          spinning={spinning}
          setSpinning={setSpinning}
          hub="L"
          onPick={(idx) => {
            setLanded(idx);
            const prize = ANIMALS[idx];
            try {
              sessionStorage.setItem(WELCOME_KEY, String(prize.courtesy));
            } catch {
              /* ignore */
            }
            ping(prize.courtesy ? "bonus" : "lose");
            showBanner({
              kind: prize.jackpot ? "jackpot" : prize.courtesy ? "win" : "lose",
              title: prize.jackpot ? tr("jackpotHit") : prize.courtesy ? tr("gateWon") : tr("gateMiss"),
              sub: `${prize.emoji} G ${formatChips(prize.courtesy)}`,
            });
          }}
        />
      </div>

      <div className="mt-2 flex items-center justify-center gap-2 text-sm text-[var(--gold-2)]">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-rose-600 text-[10px]">⏱</span>
        {pad(Math.floor(left / 60))}:{pad(left % 60)}
      </div>

      {animal && (
        <p className="mt-3 text-center font-[family-name:var(--font-playfair)] text-xl gold-text">
          {animal.emoji} {tr("gateWon")} <Chip n={animal.courtesy} size="sm" />
        </p>
      )}

      <button className="btn-gold mt-6 h-12 w-full rounded-full text-base" disabled={spinning} onClick={() => spinRef.current?.start()}>
        {spinning ? tr("gateSpinning") : animal ? tr("gateAgain") : tr("gateSpin")}
      </button>
      <button className="btn-gold mt-3 h-12 w-full rounded-full text-base" onClick={onRegister}>
        {tr("gateCta")}
      </button>
      <p className="mt-4 text-center text-[11px] text-[var(--muted)]">{tr("playOnly")}</p>
    </div>
  );
}
