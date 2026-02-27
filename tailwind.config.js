/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: ["light", "dark"],
    darkTheme: "dark",
  },
}

