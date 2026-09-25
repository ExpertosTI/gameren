"use client";

import { useEffect, useState } from "react";
import { useClub } from "@/lib/store";

type Msg = { id: number; from: "you" | "luxa"; text: string };

const KEY = "luxa.chat.v1";

function reply(text: string, locale: "es" | "en"): string {
  const q = text.toLowerCase();
  if (q.includes("pago") || q.includes("tarjeta") || q.includes("card") || q.includes("paypal")) {
    return locale === "es"
      ? "LUXA no cobra ni paga dinero real. Depositar solo suma fichas de juego."
      : "LUXA never takes or pays real money. Deposit only adds play chips.";
  }
  if (q.includes("vip")) {
    return locale === "es" ? "El Club VIP sube al jugar. Mira tu rango en Cuenta." : "VIP rank rises as you play. Check Account.";
  }
  return locale === "es"
    ? "Club LUXA aquí. Fichas virtuales, mesas propias y sin apuestas con dinero real."
    : "LUXA club here. Virtual chips, original tables, no real-money bets.";
}

export function ChatPanel() {
  const { tr, profile } = useClub();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setMsgs(JSON.parse(raw) as Msg[]);
      else {
        setMsgs([
          {
            id: 1,
            from: "luxa",
            text: profile.locale === "es" ? "Hola. Soy el club. ¿En qué te ayudo?" : "Hi. This is the club. How can I help?",
          },
        ]);
      }
    } catch {
      setMsgs([]);
    }
  }, [profile.locale]);

  useEffect(() => {
    if (msgs.length) localStorage.setItem(KEY, JSON.stringify(msgs.slice(-40)));
  }, [msgs]);

  const send = () => {
    const clean = text.trim();
    if (!clean) return;
    const yours: Msg = { id: Date.now(), from: "you", text: clean };
    setText("");
    setMsgs((m) => [...m, yours]);
    window.setTimeout(() => {
      setMsgs((m) => [...m, { id: Date.now() + 1, from: "luxa", text: reply(clean, profile.locale) }]);
    }, 500);
  };

  return (
    <div className="flex h-[420px] flex-col">
      <p className="mb-2 text-xs text-[var(--muted)]">{tr("chatHint")}</p>
      <div className="flex-1 space-y-2 overflow-y-auto rounded-2xl bg-black/20 p-3">
        {msgs.map((m) => (
          <div key={m.id} className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${m.from === "you" ? "ml-auto btn-gold" : "glass"}`}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={tr("chatPh")}
          className="h-11 flex-1 rounded-full border border-[var(--line)] bg-black/20 px-4"
        />
        <button className="btn-gold rounded-full px-4" onClick={send}>
          {tr("chatSend")}
        </button>
      </div>
    </div>
  );
}

export function ChatFab() {
  const { go, tr } = useClub();
  return (
    <button
      className="fixed bottom-[108px] right-[max(1rem,calc(50%-200px))] z-30 grid h-12 w-12 place-items-center rounded-full bg-[#1a4bff] text-lg text-white shadow-lg"
      onClick={() => go("support")}
      aria-label={tr("supportChat")}
    >
      ◕
    </button>
  );
}
