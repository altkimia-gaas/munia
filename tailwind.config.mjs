/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: '#2196F3',
          dark: '#1565C0',
          xdark: '#0D47A1',
          light: '#42A5F5',
          pale: '#E3F2FD',
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
