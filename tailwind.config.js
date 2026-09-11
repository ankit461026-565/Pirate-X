/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ocean: {
          900: '#0a0e1a',
          800: '#0f1525',
          700: '#161d33',
          600: '#1e2745',
          500: '#2a3560',
          400: '#3d4d80',
        },
        parchment: {
          100: '#f5e6c8',
          200: '#ebd5a3',
          300: '#dcc487',
          400: '#c9ad6a',
          500: '#b3954e',
          600: '#9a7e3a',
          700: '#7d6529',
          800: '#5e4b1c',
        },
        gold: {
          300: '#f0d480',
          400: '#e6c25e',
          500: '#d4a83c',
          600: '#b88a26',
          700: '#94701c',
        },
        bronze: {
          400: '#c08a4e',
          500: '#a66f38',
          600: '#865828',
        },
        ember: {
          400: '#e87a3e',
          500: '#d9682f',
          600: '#b85524',
        },
        cursed: {
          500: '#8b2c2c',
          600: '#6e2222',
        },
      },
      fontFamily: {
        display: ['"Cinzel Decorative"', 'serif'],
        pirate: ['"Pirata One"', 'cursive'],
        body: ['"EB Garamond"', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.7s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.7s ease-out forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite',
        'node-pulse': 'nodePulse 2s ease-in-out infinite',
        'fog-drift': 'fogDrift 30s linear infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'float-slower': 'floatSlow 9s ease-in-out infinite',
        'shine': 'shine 3s ease-in-out infinite',
        'compass-spin': 'compassSpin 20s linear infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'treasure-burst': 'treasureBurst 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'shake': 'shake 0.5s ease-in-out',
        'progress-fill': 'progressFill 1s ease-out forwards',
        'ember-rise': 'emberRise 4s ease-in infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 168, 60, 0.3), 0 0 40px rgba(212, 168, 60, 0.1)' },
          '50%': { boxShadow: '0 0 30px rgba(212, 168, 60, 0.6), 0 0 60px rgba(212, 168, 60, 0.2)' },
        },
        nodePulse: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 15px rgba(212, 168, 60, 0.4)' },
          '50%': { transform: 'scale(1.08)', boxShadow: '0 0 30px rgba(212, 168, 60, 0.7)' },
        },
        fogDrift: {
          '0%': { transform: 'translateX(-10%)' },
          '100%': { transform: 'translateX(10%)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        shine: {
          '0%, 100%': { textShadow: '0 0 10px rgba(212, 168, 60, 0.3)' },
          '50%': { textShadow: '0 0 20px rgba(212, 168, 60, 0.6), 0 0 30px rgba(212, 168, 60, 0.2)' },
        },
        compassSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
        treasureBurst: {
          '0%': { opacity: '0', transform: 'scale(0.3) rotate(-10deg)' },
          '60%': { opacity: '1', transform: 'scale(1.15) rotate(2deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-6px)' },
          '80%': { transform: 'translateX(6px)' },
        },
        progressFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--target-width, 100%)' },
        },
        emberRise: {
          '0%': { opacity: '0', transform: 'translateY(0) scale(1)' },
          '20%': { opacity: '0.8' },
          '100%': { opacity: '0', transform: 'translateY(-100px) scale(0.3)' },
        },
      },
    },
  },
  plugins: [],
};
