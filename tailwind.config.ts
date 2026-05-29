import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#151513",
        paper: "#f6f0df",
        bru: "#2774ae",
        gold: "#ffd100",
        clay: "#b85c38",
        moss: "#587a4d"
      },
      boxShadow: {
        card: "0 18px 45px rgba(21,21,19,.12)"
      }
    }
  },
  plugins: []
};

export default config;
