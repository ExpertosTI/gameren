import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Outfit, Playfair_Display } from "next/font/google";
import { BIP_SCRIPT } from "@/lib/install";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LUXA — Club 3D",
  description: "Club social 3D con fichas virtuales, Club VIP y mesas en tiempo real. Sin dinero real.",
  applicationName: "LUXA",
  appleWebApp: { capable: true, title: "LUXA", statusBarStyle: "black-translucent" },
  icons: { icon: "/brand/icon.png", apple: "/brand/icon.png" },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#070b14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${outfit.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Script id="luxa-bip" strategy="beforeInteractive">
          {BIP_SCRIPT}
        </Script>
        {children}
      </body>
    </html>
  );
}
