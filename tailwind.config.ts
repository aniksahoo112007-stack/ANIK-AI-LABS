import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: "#060b1a",
          50: "#0a1228",
          100: "#0d1733",
          200: "#101d40",
          900: "#04081299",
        },
        teal: {
          glow: "#2dd4bf",
        },
        cyan: {
          glow: "#22d3ee",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-glow":
          "linear-gradient(to right, rgba(45,212,191,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(45,212,191,0.06) 1px, transparent 1px)",
        "radial-teal":
          "radial-gradient(circle at 50% 0%, rgba(45,212,191,0.18), transparent 60%)",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(45,212,191,0.45)",
        "glow-cyan": "0 0 50px -12px rgba(34,211,238,0.5)",
        card: "0 8px 40px -12px rgba(0,0,0,0.6)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse-slow 5s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
