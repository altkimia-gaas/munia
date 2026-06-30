/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: '#4F46E5',
          dark: '#4338CA',
          xdark: '#002449',
          light: '#818CF8',
          pale: '#EEF2FF',
        },
        // Dark design system (hero, diagnostic page)
        dark: {
          1: '#080B12',
          2: '#0D1117',
          3: '#111827',
          border: '#1E2D4A',
          text: '#F0F4FF',
          muted: '#8B9DC3',
        },
      },
    },
  },
  plugins: [],
};
