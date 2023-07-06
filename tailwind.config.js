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
    fontFamily: {
      script: ["Permanent Marker"],
    },
    extend: {
      borderWidth: {
        6: "6px",
      },
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
        tan: {
          50: "#f9f7f7",
          100: "#f3eeed",
          200: "#e9e1df",
          300: "#d9cbc8",
          400: "#c9b5b1",
          500: "#ab8e88",
          600: "#93756f",
          700: "#7a605b",
          800: "#67514d",
          900: "#584744",
          950: "#2d2422",
        },
      },
    },
  },
};
