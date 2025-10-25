/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        mova: ["var(--font-mova)", "sans-serif"],
        seagram: ["var(--font-seagram)", "sans-serif"],
        madeTommy: ["var(--font-made-tommy)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
