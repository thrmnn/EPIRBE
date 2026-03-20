/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        radio: {
          bg: "#0a0a0f",
          surface: "#12121a",
          border: "#1e1e2e",
          accent: "#e63946",
          text: "#e0e0e0",
          muted: "#6b7280",
        },
      },
      keyframes: {
        "eq-1": {
          "0%, 100%": { height: "4px" },
          "50%": { height: "16px" },
        },
        "eq-2": {
          "0%, 100%": { height: "12px" },
          "50%": { height: "4px" },
        },
        "eq-3": {
          "0%, 100%": { height: "8px" },
          "50%": { height: "16px" },
        },
      },
      animation: {
        "eq-1": "eq-1 0.8s ease-in-out infinite",
        "eq-2": "eq-2 0.6s ease-in-out infinite",
        "eq-3": "eq-3 0.9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
