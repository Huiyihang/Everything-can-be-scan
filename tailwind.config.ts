import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#171820",
        muted: "#667085",
        paper: "#f7f8fb",
        line: "#d9dee8",
        mint: "#19b59f",
        coral: "#f06f5f",
        lemon: "#f2c94c"
      },
      boxShadow: {
        panel: "0 18px 48px rgba(29, 41, 57, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
