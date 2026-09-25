import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "club.luxa.app",
  appName: "LUXA",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
  android: {
    allowMixedContent: true,
  },
  plugins: {
    StatusBar: {
      style: "DARK",
      backgroundColor: "#070b14",
    },
  },
};

export default config;
