/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          900: "#0a0b0e",
          800: "#0f1117",
          700: "#161820",
          600: "#1c1f2a",
          500: "#232636",
          400: "#2d3148",
        },
        accent: {
          purple: "#8B5CF6",
          green: "#10B981",
          yellow: "#F59E0B",
          red: "#EF4444",
          blue: "#3B82F6",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
