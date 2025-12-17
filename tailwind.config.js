/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A1A2F',
        secondary: '#1F3C88',
        accent: '#1FD1C1',
        highlight: '#4DA3FF',
        ui: {
          dark: '#070D18',
          light: '#F4F7FB',
          card: '#0F1E33',
          border: '#233A5E'
        },
        text: {
          primary: '#EAF1FF',
          secondary: '#A9B8D9',
          muted: '#7A8AAE'
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(31, 209, 193, 0.4)',
        'glow-blue': '0 0 20px rgba(77, 163, 255, 0.4)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}