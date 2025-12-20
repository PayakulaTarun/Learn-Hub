/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // Custom breakpoints matching the required strategy
    screens: {
      'xs': '360px',
      'sm': '481px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
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
          border: '#233A5E',
        },
        text: {
          primary: '#EAF1FF',
          secondary: '#A9B8D9',
          muted: '#7A8AAE',
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(31, 209, 193, 0.4)',
        'glow-blue': '0 0 20px rgba(77, 163, 255, 0.4)',
        'glow-indigo': '0 0 20px rgba(79, 70, 229, 0.4)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      // Fluid typography using clamp() for responsive scaling
      fontSize: {
        xs: 'clamp(0.75rem, 1vw + 0.4rem, 0.8125rem)',
        sm: 'clamp(0.8125rem, 1vw + 0.5rem, 0.875rem)',
        base: 'clamp(0.875rem, 1vw + 0.6rem, 1rem)',
        lg: 'clamp(1rem, 1vw + 0.8rem, 1.125rem)',
        xl: 'clamp(1.125rem, 1vw + 1rem, 1.25rem)',
        '2xl': 'clamp(1.25rem, 1vw + 1.2rem, 1.5rem)',
        '3xl': 'clamp(1.5rem, 1.5vw + 1.5rem, 1.875rem)',
        '4xl': 'clamp(1.875rem, 2vw + 2rem, 2.25rem)',
        '5xl': 'clamp(2.25rem, 2.5vw + 2.5rem, 3rem)',
      },
    },
  },
  plugins: [],
};