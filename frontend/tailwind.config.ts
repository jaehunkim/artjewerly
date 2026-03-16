import type { Config } from "tailwindcss";

// Tailwind v4: theme configuration lives in globals.css via @theme.
// This file only needs to specify content paths.
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};

export default config;
