/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        sand: {
          50: "#faf8f3",
          100: "#f4ede0",
          200: "#e8d9c0",
          300: "#d9bf97",
          400: "#c9a06e",
          500: "#b8834d",
          600: "#9e6b3c",
          700: "#825532",
          800: "#6b432c",
          900: "#573828",
        },
        ocean: {
          50: "#eff8ff",
          100: "#dbeffe",
          200: "#bfe3fd",
          300: "#93d0fb",
          400: "#60b4f7",
          500: "#3b93f2",
          600: "#2574e6",
          700: "#1d5dd3",
          800: "#1e4bab",
          900: "#1e4287",
        },
        forest: {
          500: "#2d6a4f",
          600: "#1b4332",
        },
        coral: {
          400: "#ff7a5a",
          500: "#ff5733",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease forwards",
        "slide-up": "slideUp 0.4s ease forwards",
        "scale-in": "scaleIn 0.3s ease forwards",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: "translateY(20px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        scaleIn: { from: { opacity: 0, transform: "scale(0.95)" }, to: { opacity: 1, transform: "scale(1)" } },
      },
    },
  },
  plugins: [],
};
