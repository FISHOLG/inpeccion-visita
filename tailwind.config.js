import { Colors } from "./constants/Colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./presentation/**/*.{js,jsx,ts,tsx}",
    "./constants/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        app: { ...Colors.light },
        light: { ...Colors.light },
        dark: { ...Colors.dark },
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "22px",
      },
    },
  },
  plugins: [],
};
