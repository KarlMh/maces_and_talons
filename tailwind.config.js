export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Medieval parchment palette
        parchment: {
          light: '#e8dcc8',
          DEFAULT: '#d4b896',
          dark: '#c8a870',
          darker: '#a07840',
          paper: '#f5ede0',
        },
        // Wood tones
        wood: {
          light: '#8b6f47',
          DEFAULT: '#6b5437',
          dark: '#4a3d2a',
          darker: '#2a1f14',
        },
        // Stone
        stone: {
          light: '#8b8680',
          DEFAULT: '#6b6560',
          dark: '#4b4540',
          darker: '#2b2520',
        },
        // Gold/brass
        gold: {
          light: '#ffd966',
          DEFAULT: '#e8c060',
          dark: '#c4922a',
          darker: '#8b6a1a',
        },
        // Sea blue
        sea: {
          light: '#64b4ff',
          DEFAULT: '#4a8fd9',
          dark: '#1a3a5c',
          darker: '#0f1f3c',
        },
        // Viking blue
        viking: {
          light: '#80c0ff',
          DEFAULT: '#4a7fa5',
          dark: '#2a4f7a',
        },
        // Marauder red
        marauder: {
          light: '#ff8080',
          DEFAULT: '#cc3333',
          dark: '#8b0000',
        },
      },
      fontFamily: {
        cinzel: '"Cinzel Decorative", serif',
        english: '"IM Fell English", Georgia, serif',
        medieval: '"MedievalSharp", serif',
        uncial: '"Uncial Antiqua", serif',
      },
      animation: {
        'ink-wiggle': 'ink-wiggle 0.3s ease-in-out',
        'valid-pulse': 'valid-pulse 1.2s ease-in-out infinite',
        'ember-glow': 'ember-glow 1.5s ease-in-out infinite',
        'rune-shimmer': 'rune-shimmer 2s ease-in-out infinite',
        'fade-in': 'fade-in-up 0.6s ease-out forwards',
        'fade-in-delay-1': 'fade-in-up 0.6s ease-out 0.15s both',
        'fade-in-delay-2': 'fade-in-up 0.6s ease-out 0.3s both',
      },
      keyframes: {
        'ink-wiggle': {
          '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
          '25%': { transform: 'rotate(-0.8deg) scale(1.02)' },
          '75%': { transform: 'rotate(0.8deg) scale(1.02)' },
        },
        'valid-pulse': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.1)' },
        },
        'ember-glow': {
          '0%, 100%': { boxShadow: 'inset 0 0 8px #e85d0480, 0 0 12px #e85d0440' },
          '50%': { boxShadow: 'inset 0 0 14px #ff7c1080, 0 0 20px #ff7c1060' },
        },
        'rune-shimmer': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    }
  },
  plugins: [],
}
