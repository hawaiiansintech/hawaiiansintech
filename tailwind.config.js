/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  mode: "jit",
  purge: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          50: "#fef9ec",
          100: "#fbeeca",
          200: "#f6dc91",
          300: "#f1c358",
          400: "#eead31",
          500: "#e68d1a",
          600: "#cb6a13",
          700: "#a94b14",
          800: "#8a3b16",
          900: "#713116",
          950: "#411707",
        },
      },
    },
  },
};
