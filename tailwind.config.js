import { Colors } from "./constants/Colors";
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./presentation/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        light: {
          background: Colors.light.background,
          primary: Colors.light.primary,
          secondary: Colors.light.secondary,
          terciary: Colors.light.terciary,
          success: Colors.light.success,
          danger: Colors.light.danger,
          textMain: Colors.light.textMain,
          textSecond: Colors.light.textSecond,
          navbar: Colors.light.navbar,
        },
        dark: {
          background: Colors.dark.background,

          primary: Colors.dark.primary,
          secondary: Colors.dark.secondary,
          terciary: Colors.dark.terciary,
          success: Colors.dark.success,
          danger: Colors.dark.danger,
          textMain: Colors.dark.textMain,
          textSecond: Colors.dark.textSecond,
          navbar: Colors.dark.navbar,
        },
      },
    },
  },
  plugins: [],
};
