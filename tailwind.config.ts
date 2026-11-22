import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#8B1E3F", // Maroon primary as required
          50: "#FCF3F5",
          100: "#F9E6EB",
          200: "#F2C0CD",
          300: "#EA96AC",
          400: "#DE4E76",
          500: "#8B1E3F",
          600: "#7A1A37",
          700: "#63152C",
          800: "#4D1022",
          900: "#360A17",
          foreground: "#FFFFFF",
        },
        ink: {
          DEFAULT: "#1B1B1F",
          muted: "#4A4A54",
          light: "#71717A",
        },
        clinic: {
          maroon: "#8B1E3F",
          maroonLight: "#A82B51",
          maroonDark: "#6A132D",
          green: "#10B981",
          red: "#EF4444",
          amber: "#F59E0B",
          purple: "#7C3AED",
          softPink: "#FDF2F4",
          softLavender: "#F5F3FF",
          cardDark: "#181520",
          cardLight: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(139, 30, 63, 0.08)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glow-maroon": "0 0 25px rgba(139, 30, 63, 0.35)",
        "glow-green": "0 0 20px rgba(16, 185, 129, 0.3)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
