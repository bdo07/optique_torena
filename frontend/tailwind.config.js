/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'warm-white': '#FAFAF8',
        'soft-beige': '#F1EDE5',
        'beige-light': '#F8F6F1',
        'beige-dark': '#E6DFD3',
        'dark-charcoal': '#222222',
        'charcoal-light': '#333333',
        'muted-gray': '#777777',
        'gray-light': '#EFEFEA',
        'olive': {
          DEFAULT: '#35483B',
          light: '#486150',
          dark: '#253329',
          50: '#F2F5F3',
          100: '#E2E8E4',
          900: '#1D2821',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'Manrope', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'Tajawal', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'card': '0 2px 8px -2px rgba(0, 0, 0, 0.06), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
        'dropdown': '0 4px 16px -2px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
