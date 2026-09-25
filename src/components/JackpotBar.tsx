"use client";

import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { formatChips } from "@/lib/logic";
import { readJackpot, tickJackpot, writeJackpot } from "@/lib/jackpot";
import { useClub } from "@/lib/store";

export function JackpotBar({ onPlay }: { onPlay?: () => void }) {
  const { tr } = useClub();
  const [pot, setPot] = useState(86_400);
  const [prev, setPrev] = useState(86_400);

  useEffect(() => {
    const start = readJackpot();
    setPot(start);
    setPrev(start);
    const id = window.setInterval(() => {
      setPot((n) => {
        const next = tickJackpot(n);
        writeJackpot(next);
        setPrev(n);
        return next;
      });
    }, 900);
    return () => window.clearInterval(id);
  }, []);

  return (
    <button className="jackpot-bar" onClick={onPlay} type="button">
      <span className="jackpot-live">{tr("jackpotLive")}</span>
      <strong className="gold-text">
        G{" "}
        <CountUp start={prev} end={pot} duration={0.8} separator="," formattingFn={(n) => formatChips(n)} />
      </strong>
      <span className="jackpot-hint">{tr("jackpot")}</span>
    </button>
  );
}
