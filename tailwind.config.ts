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
        primary: '#2563EB',
        secondary: '#059669',
        accent: '#DC2626',
        brand: {
          blue: '#2563EB',
          green: '#059669', 
          red: '#DC2626',
          gray: '#64748B',
          dark: '#1E293B'
        }
      }
    },
  },
  plugins: [],
};

export default config;
