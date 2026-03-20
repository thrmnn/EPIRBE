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
    },
  },
  plugins: [],
};
