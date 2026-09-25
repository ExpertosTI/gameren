"use client";

import { useMemo, useRef, useState } from "react";
import {
  drawCard,
  formatChips,
  handValue,
  reelsPayout,
  ROULETTE_REDS,
  spinReels,
  spinWheel,
  wheelPayout,
  type Card,
  type ReelSymbol,
  type WheelBet,
} from "@/lib/logic";
import { showBanner } from "@/lib/fx";
import { useClub } from "@/lib/store";
import { ReelWindow, TableCard } from "./tables";
import { LuckySpin, type LuckySpinHandle } from "./LuckySpin";
import { Chip, Screen } from "./ui";

export function ReelsGame() {
  const { tr, profile, playRound, ping } = useClub();
  const [bet, setBet] = useState(200);
  const [reels, setReels] = useState<[ReelSymbol, ReelSymbol, ReelSymbol]>(["crown", "gem", "star"]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState("");

  const spin = () => {
    if (spinning || bet > profile.chips) return;
    const next = spinReels();
    setSpinning(true);
    setResult("");
    ping("spin");
    window.setTimeout(() => {
      setReels(next);
      const payout = reelsPayout(next, bet);
      playRound(bet, payout, "reels", next.join("-"));
      setResult(payout > 0 ? `${tr("win")} +${payout}` : tr("lose"));
      showBanner({
        kind: payout > bet * 4 ? "big" : payout > 0 ? "win" : "lose",
        title: payout > 0 ? tr("win") : tr("lose"),
        sub: `G ${formatChips(payout)}`,
      });
      setSpinning(false);
    }, 1800);
  };

  return (
    <Screen title={tr("reels")} back="home">
      <p className="text-sm text-[var(--muted)]">{tr("reelsHint")}</p>
      <div className="machine">
        <div className="machine-window">
          <ReelWindow face={reels[0]} spinning={spinning} delay={0} />
          <ReelWindow face={reels[1]} spinning={spinning} delay={0.12} />
          <ReelWindow face={reels[2]} spinning={spinning} delay={0.24} />
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span>
          {tr("bet")}: <Chip n={bet} size="sm" />
        </span>
        <Chip n={profile.chips} size="sm" />
      </div>
      <input type="range" min={50} max={2000} step={50} value={bet} onChange={(e) => setBet(Number(e.target.value))} />
      <button className="btn-gold h-12 w-full rounded-2xl disabled:opacity-50" disabled={spinning} onClick={spin}>
        {tr("spin")}
      </button>
      {result && <p className="text-center font-[family-name:var(--font-playfair)] text-xl gold-text">{result}</p>}
    </Screen>
  );
}

export function WheelGame() {
  const { tr, profile, playRound, ping } = useClub();
  const spinRef = useRef<LuckySpinHandle>(null);
  const pending = useRef(0);
  const [bet, setBet] = useState(200);
  const [kind, setKind] = useState<WheelBet>({ kind: "red" });
  const [n, setN] = useState(0);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState("");

  const prizes = useMemo(
    () =>
      Array.from({ length: 37 }, (_, i) => ({
        text: String(i),
        background: i === 0 ? "#0d5a3a" : ROULETTE_REDS.has(i) ? "#8f1d24" : "#1a1a1a",
        fontColor: "#fff4d6",
      })),
    [],
  );

  const spin = () => {
    if (busy || bet > profile.chips) return;
    pending.current = spinWheel();
    ping("spin");
    spinRef.current?.start();
  };

  return (
    <Screen title={tr("wheel")} back="home">
      <p className="text-sm text-[var(--muted)]">{tr("wheelHint")}</p>
      <div className="flex justify-center">
        <LuckySpin
          ref={spinRef}
          size={280}
          prizes={prizes}
          hub={String(n)}
          pickIndex={() => pending.current}
          spinning={busy}
          setSpinning={setBusy}
          onPick={(idx) => {
            setN(idx);
            const payout = wheelPayout(idx, kind, bet);
            playRound(bet, payout, "wheel", `${kind.kind}>${idx}`);
            setResult(payout > 0 ? `${tr("win")} +${payout}` : tr("lose"));
            showBanner({
              kind: payout > bet * 4 ? "big" : payout > 0 ? "win" : "lose",
              title: payout > 0 ? tr("win") : tr("lose"),
              sub: `#${idx} · G ${formatChips(payout)}`,
            });
          }}
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button className={`rounded-2xl py-3 ${kind.kind === "red" ? "btn-gold" : "btn-ghost"}`} onClick={() => setKind({ kind: "red" })}>
          {tr("red")}
        </button>
        <button className={`rounded-2xl py-3 ${kind.kind === "black" ? "btn-gold" : "btn-ghost"}`} onClick={() => setKind({ kind: "black" })}>
          {tr("black")}
        </button>
        <button className={`rounded-2xl py-3 ${kind.kind === "green" ? "btn-gold" : "btn-ghost"}`} onClick={() => setKind({ kind: "green" })}>
          {tr("green")}
        </button>
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
      {result && <p className="text-center font-[family-name:var(--font-playfair)] text-xl gold-text">{result}</p>}
    </Screen>
  );
}

export function CardsGame() {
  const { tr, profile, playRound, ping } = useClub();
  const [bet, setBet] = useState(200);
  const [player, setPlayer] = useState<Card[]>([]);
  const [dealer, setDealer] = useState<Card[]>([]);
  const [phase, setPhase] = useState<"idle" | "play" | "done">("idle");
  const [hide, setHide] = useState(true);
  const [note, setNote] = useState("");

  const pVal = useMemo(() => handValue(player), [player]);
  const dVal = useMemo(() => handValue(dealer), [dealer]);

  const settle = (p: Card[], d: Card[]) => {
    const pv = handValue(p);
    const dv = handValue(d);
    let payout = 0;
    let label = tr("lose");
    if (pv > 21) label = tr("bust");
    else if (pv === 21 && p.length === 2 && dv !== 21) {
      payout = Math.round(bet * 2.5);
      label = tr("blackjack");
    } else if (dv > 21 || pv > dv) {
      payout = bet * 2;
      label = tr("win");
    } else if (pv === dv) {
      payout = bet;
      label = tr("push");
    }
    playRound(bet, payout, "cards", `${pv}-${dv}`);
    setNote(`${label} · ${pv} vs ${dv}`);
    setPhase("done");
  };

  const deal = () => {
    if (bet > profile.chips) return;
    ping("chip");
    const p = [drawCard(), drawCard()];
    const d = [drawCard(), drawCard()];
    setPlayer(p);
    setDealer(d);
    setHide(true);
    setNote("");
    if (handValue(p) === 21) {
      setHide(false);
      settle(p, d);
    } else setPhase("play");
  };

  const hit = () => {
    const next = [...player, drawCard()];
    setPlayer(next);
    ping("chip");
    if (handValue(next) >= 21) {
      setHide(false);
      let house = [...dealer];
      while (handValue(house) < 17) house = [...house, drawCard()];
      setDealer(house);
      settle(next, house);
    }
  };

  const stand = () => {
    setHide(false);
    let house = [...dealer];
    while (handValue(house) < 17) house = [...house, drawCard()];
    setDealer(house);
    settle(player, house);
  };

  return (
    <Screen title={tr("cards")} back="home">
      <p className="text-sm text-[var(--muted)]">{tr("cardsHint")}</p>
      <div className="felt">
        <p className="felt-label">{hide ? "• •" : dVal}</p>
        <div className="felt-row">
          {dealer.map((c, i) => (
            <TableCard key={`d${i}`} card={c} hidden={hide && i === 1} />
          ))}
        </div>
        <p className="felt-label gold">{player.length ? pVal : "—"}</p>
        <div className="felt-row">
          {player.map((c, i) => (
            <TableCard key={`p${i}`} card={c} />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span>
          {tr("bet")}: <Chip n={bet} size="sm" />
        </span>
        <Chip n={profile.chips} size="sm" />
      </div>
      <input type="range" min={50} max={2000} step={50} value={bet} disabled={phase === "play"} onChange={(e) => setBet(Number(e.target.value))} />
      {phase !== "play" ? (
        <button className="btn-gold h-12 w-full rounded-2xl" onClick={deal}>
          {tr("deal")}
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <button className="btn-ghost h-12 rounded-2xl" onClick={hit}>
            {tr("hit")}
          </button>
          <button className="btn-gold h-12 rounded-2xl" onClick={stand}>
            {tr("stand")}
          </button>
        </div>
      )}
      {note && <p className="text-center font-[family-name:var(--font-playfair)] text-xl gold-text">{note}</p>}
    </Screen>
  );
}
