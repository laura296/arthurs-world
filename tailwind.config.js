/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Fredoka One"', 'cursive'],
        body: ['"Baloo 2"', 'cursive'],
      },
      colors: {
        night: '#0f172a',
        ember: '#ef4444',
        navy: '#1e3a5f',
        sun: '#facc15',
        leaf: '#22c55e',
        sky: '#38bdf8',
        candy: '#ec4899',
      },
      animation: {
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'wiggle': 'wiggle 0.4s ease-in-out',
        'pop': 'pop 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'shake': 'shake 0.8s ease-in-out',
        'spin360': 'spin360 0.7s ease-in-out',
        'poof': 'poof 0.4s ease-out forwards',
        'dance': 'dance 1s ease-in-out',
        'fly': 'fly 1s ease-in-out',
        'sparkle-particle': 'sparkleFly 0.6s ease-out forwards',
        // Build-a-Scene animations
        'scene-walk': 'sceneWalk 3s ease-in-out infinite',
        'scene-swim': 'sceneSwin 4s ease-in-out infinite',
        'scene-fly': 'sceneFly 5s ease-in-out infinite',
        'scene-bounce': 'sceneBounce 1.5s ease-in-out infinite',
        'scene-scuttle': 'sceneScuttle 0.8s ease-in-out infinite',
        'scene-flap': 'sceneFlap 0.6s ease-in-out infinite',
        'scene-pulse': 'scenePulse 2s ease-in-out infinite',
        'sparkle-sweep': 'sparkleSweep 1.5s ease-out forwards',
        'magic-glow': 'magicGlow 2s ease-in-out infinite',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        spin360: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        poof: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '0.5' },
          '100%': { transform: 'scale(0)', opacity: '0' },
        },
        dance: {
          '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
          '25%': { transform: 'rotate(-10deg) scale(1.1)' },
          '50%': { transform: 'rotate(10deg) scale(1.05)' },
          '75%': { transform: 'rotate(-5deg) scale(1.1)' },
        },
        fly: {
          '0%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-60px)' },
          '60%': { transform: 'translateY(-40px)' },
          '100%': { transform: 'translateY(0)' },
        },
        sparkleFly: {
          '0%': { transform: 'translate(var(--tx), var(--ty)) scale(1)', opacity: '1' },
          '100%': { transform: 'translate(calc(var(--tx) * 3), calc(var(--ty) * 3)) scale(0)', opacity: '0' },
        },
        // Build-a-Scene keyframes
        sceneWalk: {
          '0%, 100%': { transform: 'translateX(0) translateY(0)' },
          '50%': { transform: 'translateX(30px) translateY(-5px)' },
        },
        sceneSwin: {
          '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
          '50%': { transform: 'translateX(20px) rotate(3deg)' },
        },
        sceneFly: {
          '0%, 100%': { transform: 'translateX(0) translateY(0)' },
          '25%': { transform: 'translateX(15px) translateY(-20px)' },
          '75%': { transform: 'translateX(-15px) translateY(-10px)' },
        },
        sceneBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        sceneScuttle: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(8px)' },
          '75%': { transform: 'translateX(-8px)' },
        },
        sceneFlap: {
          '0%, 100%': { transform: 'translateY(0) scaleY(1)' },
          '50%': { transform: 'translateY(-10px) scaleY(0.95)' },
        },
        scenePulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
        },
        sparkleSweep: {
          '0%': { transform: 'translateX(-100vw)', opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { transform: 'translateX(100vw)', opacity: '0' },
        },
        magicGlow: {
          '0%, 100%': { boxShadow: '0 0 10px #facc15, 0 0 20px #facc15' },
          '50%': { boxShadow: '0 0 20px #facc15, 0 0 40px #facc15, 0 0 60px #facc15' },
        },
      },
    },
  },
  plugins: [],
};
