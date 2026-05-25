import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        unt: {
          green: "#00853E",
          dark: "#0B1220",
          ink: "#0F172A",
          muted: "#64748B",
        },
        landing: {
          mint: "#ceffb8",
          teal: "#2fffd0",
          mid: "#91f2cf",
          dark: "#0f0f0f",
          muted: "#84a5aa",
          cream: "#fffcf6",
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "landing-hero": "linear-gradient(180deg, #ceffb8 0%, #91f2cf 59%, #3cffce 100%)",
        "landing-soft": "linear-gradient(180deg, #e8fff0 0%, #f7fffb 100%)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
