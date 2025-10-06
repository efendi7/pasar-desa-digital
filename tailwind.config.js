// tailwind.config.js
const localFont = require('next/font/local');

const seagram = localFont({
  src: './src/app/fonts/Seagram tfb.ttf',
  variable: '--font-seagram',
});

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        seagram: ['var(--font-seagram)', 'sans-serif'],
        mova: ['var(--font-mova)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
