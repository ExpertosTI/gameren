"use client";

import { useEffect, useState } from "react";
import type { BannerDetail } from "@/lib/fx";

export function WinBanner() {
  const [banner, setBanner] = useState<BannerDetail | null>(null);

  useEffect(() => {
    const onBanner = (event: Event) => {
      const detail = (event as CustomEvent<BannerDetail>).detail;
      if (!detail) return;
      setBanner(detail);
      window.setTimeout(() => setBanner((cur) => (cur === detail ? null : cur)), detail.kind === "jackpot" ? 3200 : 2200);
    };
    window.addEventListener("luxa-banner", onBanner);
    return () => window.removeEventListener("luxa-banner", onBanner);
  }, []);

  if (!banner) return null;

  return (
    <div className="win-banner" role="status" aria-live="polite">
      <div className={`win-card win-${banner.kind}`}>
        <p className="win-kicker">{banner.kind === "jackpot" ? "✦ LUXA ✦" : "LUXA"}</p>
        <h2>{banner.title}</h2>
        {banner.sub ? <p className="win-sub">{banner.sub}</p> : null}
      </div>
    </div>
  );
}
