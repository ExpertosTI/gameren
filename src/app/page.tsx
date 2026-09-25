"use client";

import { CasinoApp } from "@/components/CasinoApp";
import { ClubProvider } from "@/lib/store";

export default function Page() {
  return (
    <ClubProvider>
      <CasinoApp />
    </ClubProvider>
  );
}
