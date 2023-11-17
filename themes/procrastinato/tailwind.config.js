const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["content/**/*.md", "layouts/**/*.html"],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: [
        '"Atkinson Hyperlegible"',
        "ui-sans-serif",
        "system-ui",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
      mono: [
        '"Intel One Mono"',
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "Monaco",
        "Consolas",
        '"liberation mono"',
        '"Courier New"',
        "monospace",
      ],
    },
    extend: {
      colors: {
        eerieblack: "#1B1B1B",
        unresolvedproblem: "#f3f2ed",
        shortbread: "#FBE790",
        pastelorange: "#FEBA4F",
        outlineColor: "#60a5fa",
        info: {
          bg: {
            DEFAULT: colors.sky[50],
            dark: "rgba(14, 165, 233, 0.2)",
          },
          fg: {
            DEFAULT: colors.sky[800],
            dark: "#c3e9fa",
          },
          border: {
            DEFAULT: colors.sky[500],
            dark: "rgba(14, 165, 233, 0.5)",
          },
        },
        tip: {
          bg: {
            DEFAULT: colors.green[50],
            dark: "rgba(132, 204, 22, 0.2)",
          },
          fg: {
            DEFAULT: colors.green[900],
            dark: "#e0f2c5",
          },
          border: {
            DEFAULT: colors.green[600],
            dark: "rgba(132, 204, 22, 0.5)",
          },
        },
        warning: {
          bg: {
            DEFAULT: colors.yellow[50],
            dark: "rgba(234, 179, 8, 0.2)",
          },
          fg: {
            DEFAULT: colors.yellow[900],
            dark: "#faecc1",
          },
          border: {
            DEFAULT: colors.yellow[600],
            dark: "rgba(234, 179, 8, 0.5)",
          },
        },
        danger: {
          bg: {
            DEFAULT: colors.red[50],
            dark: "rgba(212, 25, 118, 0.2)",
          },
          fg: {
            DEFAULT: colors.red[900],
            dark: "#f4c6dd",
          },
          border: {
            DEFAULT: colors.red[600],
            dark: "rgba(212, 25, 118, 0.5)",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  safelist: ["!text-green-500", "!text-red-500", "text-blue-300", "max-w-screen-md", "max-w-screen-lg"],
};
