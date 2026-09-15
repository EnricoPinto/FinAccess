import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // AuthKit Frosted Glass Cathedral Palette
        canvas: "#05060f",
        steelPlate: "#2f343e",
        fogVeil: "#9da7ba",
        moonMist: "#c7d3ea",
        frostGlow: "#d1e4fa",
        pureWhite: "#ffffff",
        voidViolet: "#663af3",
        blueprintBlue: "#b6d9fc",
        glassEdge: "rgba(186, 215, 247, 0.12)",
        luminousFill: "rgba(199, 211, 234, 0.12)",

        // Financial semantics (soft & desaturated to preserve Void Violet discipline)
        positiveMint: "#34d399",
        negativeCoral: "#f87171",

        // Backward compatibility mappings
        bgBase: "#05060f",
        textPrimary: "#d1e4fa",
        textSecondary: "#c7d3ea",
        textMuted: "#9da7ba",
      },
      fontFamily: {
        sans: ["'Untitled Sans'", "'Inter'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ["'aeonikPro'", "'Space Grotesk'", "'Inter'", "sans-serif"],
        mono: ["'dotDigital'", "'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        badge: "6px",
        input: "6px",
        card: "16px",
        pill: "999px",
        icon: "9999px",
      },
      boxShadow: {
        // AuthKit signature inset frost glow + soft outer shadow
        glassCard:
          "inset 0 1px 1px rgba(199,211,234,0.12), inset 0 24px 48px rgba(199,211,234,0.05), 0 24px 32px rgba(6,6,14,0.7)",
        glassCardHover:
          "inset 0 1px 2px rgba(216,236,248,0.22), inset 0 24px 48px rgba(182,217,252,0.09), 0 28px 40px rgba(0,0,0,0.8)",
        voidGlow:
          "0 0 24px rgba(102, 58, 243, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.2)",
        haloSpotlight:
          "0 0 120px 30px rgba(182, 217, 252, 0.08)",
      },
      spacing: {
        cathedral: "120px",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.35s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
