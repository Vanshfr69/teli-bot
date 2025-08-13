import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { brand: { DEFAULT: "#111827" } },
      borderRadius: { '2xl': "1rem" }
    }
  },
  plugins: []
} satisfies Config;
