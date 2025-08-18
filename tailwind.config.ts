import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#059669",
        accent: "#DC2626",
        brand: {
          blue: "#2563EB",
          green: "#059669",
          red: "#DC2626",
          gray: "#64748B",
          dark: "#1E293B",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            // Headings
            h1: { fontWeight: "700", lineHeight: "1.2" },
            h2: { fontWeight: "700", lineHeight: "1.3" },
            // Links
            a: {
              color: "#2563EB",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            },
            // Code & Pre
            code: {
              backgroundColor: "rgba(0,0,0,0.04)",
              padding: "0.125rem 0.375rem",
              borderRadius: "0.375rem",
              fontWeight: "600",
            },
            "pre code": { backgroundColor: "transparent", padding: "0" },
            pre: {
              backgroundColor: "#0f172a",
              color: "#e2e8f0",
              borderRadius: "0.75rem",
              padding: "1rem",
            },
            // Blockquote
            blockquote: {
              fontStyle: "italic",
              color: "#374151",
              borderLeftColor: "#e5e7eb",
            },
            // Images
            img: { borderRadius: "0.5rem" },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
