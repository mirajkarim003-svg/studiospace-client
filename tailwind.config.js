/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Syne", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Figtree", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        pop: { "0%": { opacity: 0, transform: "translateY(12px) scale(.98)" }, "100%": { opacity: 1, transform: "none" } },
        spinSlow: { to: { transform: "rotate(360deg)" } },
      },
      animation: { pop: "pop .22s ease-out", "spin-slow": "spinSlow 2.4s linear infinite" },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    logs: false,
    darkTheme: "studiodark",
    themes: [
      {
        studiolight: {
          primary: "#4a3cf0", "primary-content": "#ffffff",
          secondary: "#0e1424", "secondary-content": "#ffffff",
          accent: "#ffd21f", "accent-content": "#1a1500",
          neutral: "#0e1424", "neutral-content": "#eef1f6",
          "base-100": "#f6f7fa", "base-200": "#eceef4", "base-300": "#d9dde8", "base-content": "#0e1424",
          info: "#2f7bff", success: "#0f9d68", warning: "#f5a300", error: "#e5484d",
        },
        studiodark: {
          primary: "#8f86ff", "primary-content": "#0b0d18",
          secondary: "#e8ebf5", "secondary-content": "#0b0d18",
          accent: "#ffd21f", "accent-content": "#1a1500",
          neutral: "#1a2036", "neutral-content": "#e8ebf5",
          "base-100": "#0c0f1a", "base-200": "#121626", "base-300": "#1f2540", "base-content": "#e8ebf5",
          info: "#5b9bff", success: "#2cc48a", warning: "#f5b73b", error: "#ff6b6f",
        },
      },
    ],
  },
};
