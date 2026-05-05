import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/hooks/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dvc: {
          bg: '#141412',
          section: '#0F1714',
          card: '#1E1E1A',
          cream: '#F0EAD8',
          muted: '#94A3B8',
          teal: '#0D9488',
          tealAlt: '#0AB99D',
          tealDark: '#116E63',
          yellow: '#FBBF24',
          border: '#2D2D2D',
          online: '#22C55E',
          forest: '#064E3B',
          discord: '#5865F2',
        },
        world: {
          wallCream: '#F0EAD8',
          wallShadow: '#E0D5BC',
          floorBase: '#E8E2D0',
          floorAccent: '#D4C9B0',
          wood: '#B8895A',
          woodDark: '#8B6440',
          chairFrame: '#2D2D2D',
          plantGreen: '#4A8B3A',
          plantPot: '#3D2D24',
          rugTeal: '#0D9488',
          rugYellow: '#FBBF24',
          rugGreen: '#84CC16',
          rugBlue: '#3B82F6',
          rugOrange: '#F97316',
          rugPurple: '#6366F1',
          rugPink: '#EC4899',
          glassYellow: '#FBBF24',
          glassGreen: '#22C55E',
          glassOrange: '#F97316',
        },
      },
      fontFamily: {
        body: ['var(--font-sora)', 'sans-serif'],
        ui: ['var(--font-nunito)', 'sans-serif'],
        hand: ['var(--font-caveat)', 'cursive'],
        display: ['var(--font-epilogue)', 'sans-serif'],
      },
      boxShadow: {
        brut: '3px 3px 0 #2D2D2D',
        brutSm: '2px 2px 0 #2D2D2D',
        brutCard: '5px 5px 0 #2D2D2D',
        brutLg: '7px 7px 0 #2D2D2D',
        brutHover: '8px 12px 0 #2D2D2D',
      },
      animation: {
        'aurora-slow': 'aurora 22s ease-in-out infinite',
        'spin-slow': 'spin 14s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(60px, -40px) scale(1.05)' },
          '66%': { transform: 'translate(-40px, 30px) scale(0.95)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
