/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dev2Scale brand palette (sampled from the logo)
        brand: {
          blue: {
            light: '#5BB8FF',
            DEFAULT: '#2E90FF',
            deep: '#1366E6',
          },
          orange: {
            light: '#FFB020',
            DEFAULT: '#FF8A2B',
            deep: '#FF6A00',
          },
        },
        ink: {
          900: '#050608',
          800: '#0A0C11',
          700: '#11141B',
          600: '#171B24',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 60px -12px rgba(46,144,255,0.45)',
        'glow-orange': '0 0 60px -12px rgba(255,138,43,0.45)',
        card: '0 30px 80px -20px rgba(0,0,0,0.85)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(100deg, #FF6A00 0%, #FF8A2B 22%, #2E90FF 78%, #1366E6 100%)',
      },
    },
  },
  plugins: [],
}
