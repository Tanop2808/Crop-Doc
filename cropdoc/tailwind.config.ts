import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Instrument Serif'", "Georgia", "serif"],
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
      },
      colors: {
        green: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#064d24",
          900: "#052e16",
        },
        cream: "#fafaf7",
      },
      animation: {
        "leaf-sway": "leafSway 4s ease-in-out infinite",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
        "fade-up": "fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both",
        spin: "spin 0.7s linear infinite",
      },
      keyframes: {
        leafSway: {
          "0%,100%": { transform: "rotate(-4deg) scale(1)" },
          "50%": { transform: "rotate(4deg) scale(1.05)" },
        },
        pulseDot: {
          "0%,100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.85)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        green: "0 12px 40px rgba(22,163,74,.12), 0 4px 16px rgba(0,0,0,.08)",
        "green-xl": "0 24px 60px rgba(22,163,74,.16), 0 8px 24px rgba(0,0,0,.1)",
      },
    },
  },
  plugins: [],
};
export default config;
