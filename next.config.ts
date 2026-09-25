import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  turbopack: {
    root: path.join(__dirname),
  },
  transpilePackages: ["three", "@lucky-canvas/react", "lucky-canvas", "canvas-confetti"],
};

export default nextConfig;
