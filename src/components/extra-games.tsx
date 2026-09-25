"use client";

import { useEffect, useRef, useState } from "react";
import { useClub } from "@/lib/store";
import { Chip, Screen } from "./ui";

function BetBar({
  bet,
  setBet,
  chips,
  disabled,
}: {
  bet: number;
  setBet: (n: number) => void;
  chips: number;
  disabled?: boolean;
}) {
  const { tr } = useClub();
  return (
    <>
      <div className="flex items-center justify-between text-sm">
        <span>
          {tr("bet")}: <Chip n={bet} size="sm" />
        </span>
        <Chip n={chips} size="sm" />
      </div>
      <input type="range" min={50} max={2000} step={50} value={bet} disabled={disabled} onChange={(e) => setBet(Number(e.target.value))} />
    </>
  );
}

export function CrashGame() {
  const { tr, profile, playRound, ping } = useClub();
  const [bet, setBet] = useState(200);
  const [mult, setMult] = useState(1);
  const [live, setLive] = useState(false);
  const [note, setNote] = useState("");
  const crashAt = useRef(2);
  const cashed = useRef(false);

  const start = () => {
    if (live || bet > profile.chips) return;
    cashed.current = false;
    crashAt.current = 1.15 + Math.random() * 4.2;
    setMult(1);
    setNote("");
    setLive(true);
    ping("spin");
  };

  useEffect(() => {
    if (!live) return;
    let current = 1;
    const t = window.setInterval(() => {
      current = Math.round((current + 0.06 + current * 0.012) * 100) / 100;
      if (current >= crashAt.current) {
        window.clearInterval(t);
        setMult(crashAt.current);
        setLive(false);
        if (!cashed.current) {
          playRound(bet, 0, "crash", `x${crashAt.current.toFixed(2)}`);
          setNote(`${tr("lose")} · x${crashAt.current.toFixed(2)}`);
        }
        return;
      }
      setMult(current);
    }, 80);
    return () => window.clearInterval(t);
  }, [live]);

  const out = () => {
    if (!live || cashed.current) return;
    cashed.current = true;
    const payout = Math.round(bet * mult);
    playRound(bet, payout, "crash", `out-x${mult}`);
    setNote(`${tr("win")} +${payout}`);
    setLive(false);
  };

  return (
    <Screen title={tr("crash")} back="home">
      <p className="text-sm text-[var(--muted)]">{tr("crashHint")}</p>
      <div className="felt grid h-48 place-items-center">
        <p className="font-[family-name:var(--font-playfair)] text-6xl gold-text">{mult.toFixed(2)}x</p>
      </div>
      <BetBar bet={bet} setBet={setBet} chips={profile.chips} disabled={live} />
      {live ? (
        <button className="btn-gold h-12 w-full rounded-2xl" onClick={out}>
          {tr("cashout")}
        </button>
      ) : (
        <button className="btn-gold h-12 w-full rounded-2xl" onClick={start}>
          {tr("play")}
        </button>
      )}
      {note && <p className="text-center font-[family-name:var(--font-playfair)] text-xl gold-text">{note}</p>}
    </Screen>
  );
}

const PLINKO = [5.6, 2.2, 1.3, 0.7, 0.4, 0.7, 1.3, 2.2, 5.6];

export function PlinkoGame() {
  const { tr, profile, playRound, ping } = useClub();
  const [bet, setBet] = useState(200);
  const [slot, setSlot] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  const drop = () => {
    if (busy || bet > profile.chips) return;
    setBusy(true);
    setNote("");
    ping("spin");
    let pos = 4;
    for (let i = 0; i < 8; i++) pos += Math.random() < 0.5 ? -0.5 : 0.5;
    const idx = Math.max(0, Math.min(8, Math.round(pos)));
    window.setTimeout(() => {
      setSlot(idx);
      const payout = Math.round(bet * PLINKO[idx]);
      playRound(bet, payout, "plinko", `s${idx}`);
      setNote(payout > 0 ? `${tr("win")} x${PLINKO[idx]}` : tr("lose"));
      setBusy(false);
    }, 900);
  };

  return (
    <Screen title={tr("plinko")} back="home">
      <p className="text-sm text-[var(--muted)]">{tr("plinkoHint")}</p>
      <div className="felt py-4">
        <div className="flex justify-center gap-3 text-lg">
          {Array.from({ length: 8 }, (_, r) => (
            <div key={r} className="flex flex-col items-center gap-2">
              {Array.from({ length: r + 3 }, (_, i) => (
                <i key={i} className="h-2 w-2 rounded-full bg-[var(--gold)]/70" />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-9 gap-1 text-center text-[10px]">
          {PLINKO.map((m, i) => (
            <span key={i} className={`rounded-md py-1 ${slot === i ? "btn-gold" : "btn-ghost"}`}>
              {m}x
            </span>
          ))}
        </div>
      </div>
      <BetBar bet={bet} setBet={setBet} chips={profile.chips} disabled={busy} />
      <button className="btn-gold h-12 w-full rounded-2xl" disabled={busy} onClick={drop}>
        {tr("drop")}
      </button>
      {note && <p className="text-center font-[family-name:var(--font-playfair)] text-xl gold-text">{note}</p>}
    </Screen>
  );
}

export function DiceGame() {
  const { tr, profile, playRound, ping } = useClub();
  const [bet, setBet] = useState(200);
  const [line, setLine] = useState(50);
  const [over, setOver] = useState(true);
  const [roll, setRoll] = useState<number | null>(null);
  const [note, setNote] = useState("");

  const play = () => {
    if (bet > profile.chips) return;
    const n = Math.floor(Math.random() * 100) + 1;
    setRoll(n);
    ping("chip");
    const win = over ? n > line : n < line;
    const chance = over ? 100 - line : line;
    const mult = chance <= 5 ? 12 : Math.max(1.05, (95 / chance) * 0.96);
    const payout = win ? Math.round(bet * mult) : 0;
    playRound(bet, payout, "dice", `${n}/${line}`);
    setNote(win ? `${tr("win")} ${n}` : `${tr("lose")} ${n}`);
  };

  return (
    <Screen title={tr("dice")} back="home">
      <p className="text-sm text-[var(--muted)]">{tr("diceHint")}</p>
      <div className="felt grid h-36 place-items-center">
        <p className="font-[family-name:var(--font-playfair)] text-6xl gold-text">{roll ?? "—"}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button className={over ? "btn-gold rounded-2xl py-3" : "btn-ghost rounded-2xl py-3"} onClick={() => setOver(true)}>
          {tr("over")} {line}
        </button>
        <button className={!over ? "btn-gold rounded-2xl py-3" : "btn-ghost rounded-2xl py-3"} onClick={() => setOver(false)}>
          {tr("under")} {line}
        </button>
      </div>
      <input type="range" min={5} max={95} value={line} onChange={(e) => setLine(Number(e.target.value))} />
      <BetBar bet={bet} setBet={setBet} chips={profile.chips} />
      <button className="btn-gold h-12 w-full rounded-2xl" onClick={play}>
        {tr("play")}
      </button>
      {note && <p className="text-center font-[family-name:var(--font-playfair)] text-xl gold-text">{note}</p>}
    </Screen>
  );
}

export function MinesGame() {
  const { tr, profile, playRound, ping } = useClub();
  const [bet, setBet] = useState(200);
  const [bombs, setBombs] = useState<Set<number>>(new Set());
  const [open, setOpen] = useState<number[]>([]);
  const [dead, setDead] = useState(false);
  const [note, setNote] = useState("");
  const live = bombs.size > 0 && !dead && note === "";

  const start = () => {
    if (bet > profile.chips) return;
    const bag = new Set<number>();
    while (bag.size < 4) bag.add(Math.floor(Math.random() * 25));
    setBombs(bag);
    setOpen([]);
    setDead(false);
    setNote("");
    ping("chip");
  };

  const pick = (i: number) => {
    if (!live || open.includes(i)) return;
    if (bombs.has(i)) {
      setDead(true);
      playRound(bet, 0, "mines", "boom");
      setNote(tr("lose"));
      return;
    }
    ping("chip");
    setOpen((o) => [...o, i]);
  };

  const cash = () => {
    if (!live || open.length === 0) return;
    const payout = Math.round(bet * (1 + open.length * 0.28));
    playRound(bet, payout, "mines", `safe-${open.length}`);
    setNote(`${tr("win")} +${payout}`);
    setBombs(new Set());
  };

  return (
    <Screen title={tr("mines")} back="home">
      <p className="text-sm text-[var(--muted)]">{tr("minesHint")}</p>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 25 }, (_, i) => {
          const seen = open.includes(i) || dead;
          const bomb = bombs.has(i);
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              className={`h-12 rounded-xl ${seen && bomb ? "bg-rose-700" : seen ? "btn-gold" : "btn-ghost"}`}
            >
              {seen ? (bomb ? "●" : "✦") : ""}
            </button>
          );
        })}
      </div>
      <BetBar bet={bet} setBet={setBet} chips={profile.chips} disabled={live} />
      {live ? (
        <button className="btn-gold h-12 w-full rounded-2xl" onClick={cash}>
          {tr("cashout")} · x{(1 + open.length * 0.28).toFixed(2)}
        </button>
      ) : (
        <button className="btn-gold h-12 w-full rounded-2xl" onClick={start}>
          {tr("play")}
        </button>
      )}
      {note && <p className="text-center font-[family-name:var(--font-playfair)] text-xl gold-text">{note}</p>}
    </Screen>
  );
}
