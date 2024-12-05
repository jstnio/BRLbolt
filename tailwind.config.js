/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef1f8',
          100: '#d9e0f0',
          200: '#bbc8e4',
          300: '#93a7d4',
          400: '#6c86c4',
          500: '#4f69b4',
          600: '#193375', // BRL logo color
          700: '#162a60',
          800: '#12234d',
          900: '#0e1b3d',
        },
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Lexend"', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '112': '28rem',
        '128': '32rem',
      },
      boxShadow: {
        'hubspot': '0 2px 4px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};