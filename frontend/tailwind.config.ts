import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        vaidya: {
          bg: '#0F1117',
          panel: '#171A22',
          line: 'rgba(255,255,255,0.08)',
          text: '#E8DCC8',
          muted: 'rgba(232,220,200,0.62)',
          teal: '#5DCAA5',
          green: '#0F6E56',
          saffron: '#D9A441',
          rose: '#E06C75',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config

