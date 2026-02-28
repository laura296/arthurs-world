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
        // Pop Critters animations
        'critter-rise': 'critterRise 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'critter-sink': 'critterSink 0.4s ease-in',
        'critter-squish': 'critterSquish 0.3s ease-out',
        'hole-highlight': 'holeHighlight 0.5s ease-out',
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
        // Storybook tactile animations
        'press-in': 'pressIn 0.1s ease-out',
        'flap-open': 'flapOpen 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'flap-close': 'flapClose 0.3s ease-in forwards',
        'speech-pop': 'speechPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'spring-snap': 'springSnap 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'collect-fly': 'collectFly 0.6s ease-in forwards',
        'peek-reveal': 'peekReveal 0.4s ease-out',
        'page-curl-out': 'pageCurlOut 0.6s ease-in-out forwards',
        'page-curl-in': 'pageCurlIn 0.6s ease-in-out forwards',
        'screen-shake': 'screenShake 0.4s ease-in-out',
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
        // Pop Critters keyframes
        critterRise: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0%)' },
        },
        critterSink: {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        critterSquish: {
          '0%': { transform: 'scale(1, 1)' },
          '50%': { transform: 'scale(1.15, 0.85)' },
          '100%': { transform: 'scale(1, 1)' },
        },
        holeHighlight: {
          '0%': { boxShadow: '0 0 0 0 rgba(250, 204, 21, 0.6)' },
          '100%': { boxShadow: '0 0 20px 10px rgba(250, 204, 21, 0)' },
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
        // Storybook tactile keyframes
        pressIn: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.95)' },
        },
        flapOpen: {
          '0%': { transform: 'perspective(600px) rotateX(0deg)', transformOrigin: 'top center' },
          '100%': { transform: 'perspective(600px) rotateX(-160deg)', transformOrigin: 'top center' },
        },
        flapClose: {
          '0%': { transform: 'perspective(600px) rotateX(-160deg)', transformOrigin: 'top center' },
          '100%': { transform: 'perspective(600px) rotateX(0deg)', transformOrigin: 'top center' },
        },
        speechPop: {
          '0%': { transform: 'scale(0) translateY(10px)', opacity: '0' },
          '60%': { transform: 'scale(1.1) translateY(-5px)', opacity: '1' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        springSnap: {
          '0%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.15)' },
          '50%': { transform: 'scale(0.95)' },
          '70%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        collectFly: {
          '0%': { transform: 'translate(0, 0) scale(1)', opacity: '1' },
          '50%': { transform: 'translate(var(--fly-x), var(--fly-y)) scale(0.6)', opacity: '0.8' },
          '100%': { transform: 'translate(var(--fly-x), var(--fly-y)) scale(0.3)', opacity: '0' },
        },
        peekReveal: {
          '0%': { transform: 'scale(0.5) translateY(20px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        pageCurlOut: {
          '0%': { transform: 'perspective(1200px) rotateY(0deg)', transformOrigin: 'left center' },
          '100%': { transform: 'perspective(1200px) rotateY(-90deg)', transformOrigin: 'left center' },
        },
        pageCurlIn: {
          '0%': { transform: 'perspective(1200px) rotateY(90deg)', transformOrigin: 'right center' },
          '100%': { transform: 'perspective(1200px) rotateY(0deg)', transformOrigin: 'right center' },
        },
        screenShake: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-6px, -3px)' },
          '20%': { transform: 'translate(5px, 4px)' },
          '30%': { transform: 'translate(-4px, 2px)' },
          '40%': { transform: 'translate(3px, -5px)' },
          '50%': { transform: 'translate(-3px, 3px)' },
          '60%': { transform: 'translate(4px, -2px)' },
          '70%': { transform: 'translate(-2px, 4px)' },
          '80%': { transform: 'translate(2px, -3px)' },
          '90%': { transform: 'translate(-1px, 2px)' },
        },
      },
    },
  },
  plugins: [],
};
