/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : { 
        'main-color' : "var(--main-color)",
        "sec-color" : "var(--sec-color)",
        "third-color" : "var(--third-color)",
        "background-color" : "var(--background-color)",
      },
      backgroundImage: { 
        hero: "url('./src/assets/op2.jpg')"
      }
    },
  },
  plugins: [],
}

