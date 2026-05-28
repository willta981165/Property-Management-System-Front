const tokens = require('./tools/design-tokens.cjs');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./apps/app-community-building/src/**/*.{html,ts}', './libs/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: tokens.colors,
      borderRadius: tokens.borderRadius,
      boxShadow: tokens.boxShadow,
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
