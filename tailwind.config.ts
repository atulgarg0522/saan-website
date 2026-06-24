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
        background: "#0a0a0f",
        foreground: "#f1f5f9",
        "saan-bg": "#0a0a0f",
        "saan-surface": "rgba(255,255,255,0.04)",
        "saan-border": "rgba(255,255,255,0.08)",
        "saan-text": "#f1f5f9",
        "saan-muted": "#94a3b8",
        "saan-purple": {
          DEFAULT: "#7c3aed",
          light: "#a78bfa",
        },
        "saan-teal": {
          DEFAULT: "#0d9488",
          light: "#5eead4",
        },
        "saan-amber": "#f59e0b",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
