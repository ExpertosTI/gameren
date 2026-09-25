"use client";

import { useEffect, useState } from "react";
import { isAppleMobile, isStandalone, readInstallEvent, type InstallEvent } from "@/lib/install";
import { useClub } from "@/lib/store";

export function InstallBar() {
  const { tr } = useClub();
  const [event, setEvent] = useState<InstallEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
    if (isStandalone()) return;
    const attach = () => setEvent(readInstallEvent());
    attach();
    window.addEventListener("luxa-can-install", attach);
    const late = (e: Event) => {
      e.preventDefault();
      window.__luxaBIP = e as InstallEvent;
      setEvent(e as InstallEvent);
    };
    window.addEventListener("beforeinstallprompt", late);
    setIos(isAppleMobile());
    return () => {
      window.removeEventListener("luxa-can-install", attach);
      window.removeEventListener("beforeinstallprompt", late);
    };
  }, []);

  if (hide || isStandalone()) return null;
  if (!event && !ios) return null;

  return (
    <div className="install-bar">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[var(--champagne)]">{tr("install")}</p>
        <p className="truncate text-[11px] text-[var(--muted)]">{ios && !event ? tr("installIos") : tr("installHint")}</p>
      </div>
      {event && (
        <button
          className="btn-gold shrink-0 rounded-full px-3 py-1.5 text-xs"
          onClick={async () => {
            await event.prompt();
            setHide(true);
          }}
        >
          {tr("installGo")}
        </button>
      )}
      <button className="shrink-0 px-1 text-[var(--muted)]" onClick={() => setHide(true)} aria-label="ok">
        ✕
      </button>
    </div>
  );
}

export const PwaBoot = InstallBar;
