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
        background: "#0A0A0B",
        surface: {
          DEFAULT: "#121214",
          elevated: "#18181B",
          subtle: "#27272A",
          glass: "rgba(18, 18, 20, 0.75)",
        },
        gold: {
          50: "#FAF6E8",
          100: "#F4ECC7",
          200: "#E9D994",
          300: "#DEC560",
          400: "#D4B43B",
          500: "#D4AF37", // Main Champagne Gold
          600: "#C5A059", // Warm Gold
          700: "#996515", // Deep Bronze Gold
          800: "#6B440D",
          900: "#3D2506",
          accent: "#E6CA65",
        },
        obsidian: {
          950: "#050507",
          900: "#0A0A0B",
          850: "#101013",
          800: "#141418",
          700: "#1C1C22",
        },
        ivory: "#F5F5F0",
        platinum: "#A1A1AA",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Cinzel", "Cormorant Garamond", "Playfair Display", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        "gold-glow": "0 0 25px -5px rgba(212, 175, 55, 0.25)",
        "gold-glow-lg": "0 0 45px -10px rgba(212, 175, 55, 0.35)",
        "glass-inset": "inset 0 1px 1px 0 rgba(255, 255, 255, 0.08)",
        "dark-elevated": "0 20px 40px -15px rgba(0, 0, 0, 0.8)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #996515 100%)",
        "gold-subtle": "linear-gradient(180deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0) 100%)",
        "glass-radial": "radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.08) 0%, rgba(10, 10, 11, 0) 70%)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
