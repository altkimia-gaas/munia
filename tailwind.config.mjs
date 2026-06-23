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
      },
    },
  },
  plugins: [],
};
