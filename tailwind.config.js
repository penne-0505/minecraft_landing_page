/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#5fbb4e', // Base
          500: '#4ea540', // Primary
          600: '#469e38', // Shadow
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        neutral: {
          50: '#f8fafc',
          100: '#f0f9ff', // Bg
          200: '#e2e8f0', // Border
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b', // Text-Sec
          600: '#475569',
          700: '#334155',
          800: '#1e293b', // Text-Pri
          900: '#0f172a', // Display
        },
        discord: {
          base: '#5865F2',
          dark: '#4752C4',
          surface: '#313338'
        },
        success: {
          50: '#ecfdf5',
          800: '#065f46'
        },
        error: {
          50: '#fff7ed',
          800: '#9a3412'
        }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['"M PLUS Rounded 1c"', 'sans-serif'],
      },
      fontSize: {
        // Desktop sizes as default, mobile adjustments to be handled via utilities or standard classes if needed
        'display': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '900' }],
        'h1': ['3.0rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h2': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h3': ['1.5rem', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '700' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'body-base': ['1.0rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'xs': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.02em' }],
        'tag': ['0.75rem', { lineHeight: '1.0', letterSpacing: '0.08em' }],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(50,60,90,0.05), inset 0 1px 0 rgba(255,255,255,1)',
        'push': '0 4px 0 var(--tw-shadow-color)',
        'inner-soft': 'inset 0 2px 4px rgba(0,0,0,0.03)',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '24px',
      },
      animation: {
        'enter-bouncy': 'enter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        enter: {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};