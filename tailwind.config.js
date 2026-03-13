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
        // Memory Match animations
        'card-flip': 'cardFlip 0.3s ease-in-out forwards',
        'card-unflip': 'cardUnflip 0.3s ease-in-out forwards',
        'starburst': 'starburst 0.5s ease-out forwards',
        'parade-enter': 'paradeEnter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'parade-exit': 'paradeExit 0.4s ease-in forwards',
        'deal-card': 'dealCard 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) backwards',
        'gold-shimmer': 'goldShimmer 0.8s ease-in-out',
        'sidekick-jump': 'sidekickJump 0.5s ease-out',
        'confetti-fall': 'confettiFall 2s linear forwards',
        // Storybook hotspot animations
        'hop-bounce': 'hopBounce 0.8s ease-in-out',
        'hotspot-pulse': 'hotspotPulse 2s ease-in-out infinite',
        'hotspot-ripple': 'hotspotRipple 0.6s ease-out forwards',
        // Premium polish: entrance & UI animations (keyframes in index.css)
        'spring-in': 'springIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth-in': 'smoothIn 0.4s ease-out',
        'gentle-in': 'gentleIn 0.4s ease-out',
        'rhythmic-in': 'rhythmicIn 0.5s ease-in-out',
        'peek-in': 'peekIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'peek-out': 'peekOut 0.3s ease-in forwards',
        'celebration-text': 'celebrationText 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        // Ellie storybook animations
        'ellie-float': 'ellieFloat 3s ease-in-out infinite',
        'ellie-glow': 'ellieGlow 2s ease-in-out infinite',
        'ellie-drift-in': 'ellieDriftIn 2s ease-out forwards',
        'ellie-shoo-away': 'ellieShooAway 0.6s ease-in forwards',
        'ellie-bob': 'ellieBob 2s ease-in-out infinite',
        'ellie-ripple': 'ellieRipple 0.6s ease-out forwards',
        'ellie-meter-pulse': 'ellieMeterPulse 0.3s ease-out',
        'ellie-spin-away': 'ellieSpinAway 0.5s ease-in forwards',
        'ellie-fade-in': 'ellieFadeIn 0.8s ease-out',
        // Inside Out character & game animations
        'io-joy-bounce': 'ioJoyBounce 3s ease-in-out infinite',
        'io-anger-shake': 'ioAngerShake 0.3s ease-in-out infinite',
        'io-anxiety-jitter': 'ioAnxietyJitter 0.15s linear infinite',
        'io-sadness-sway': 'ioSadnessSway 4s ease-in-out infinite',
        'io-fear-tremble': 'ioFearTremble 0.1s linear infinite',
        'io-float-drift': 'ioFloatDrift 5s ease-in-out infinite',
        'io-glow-pulse': 'ioGlowPulse 2s ease-in-out infinite',
        'io-slide-in-left': 'ioSlideInLeft 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'io-slide-in-right': 'ioSlideInRight 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'io-countdown-pop': 'ioCountdownPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'io-steam-rise': 'ioSteamRise 1s ease-out forwards',
        'io-ember-float': 'ioEmberFloat 1.5s ease-out forwards',
        'io-orb-roll': 'ioOrbRoll 8s linear infinite',
        'io-breathe': 'ioBreathe 3s ease-in-out infinite',
        'io-sparkle-spin': 'ioSparkleSpin 2s linear infinite',
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
        // Memory Match keyframes
        cardFlip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        cardUnflip: {
          '0%': { transform: 'rotateY(180deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
        starburst: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '0.8' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        paradeEnter: {
          '0%': { transform: 'translateX(100vw) scale(0.5)', opacity: '0' },
          '100%': { transform: 'translateX(0) scale(1)', opacity: '1' },
        },
        paradeExit: {
          '0%': { transform: 'translateX(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateX(-100vw) scale(0.5)', opacity: '0' },
        },
        dealCard: {
          '0%': { transform: 'scale(0) rotate(-10deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        goldShimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        sidekickJump: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '30%': { transform: 'translateY(-20px) scale(1.1)' },
          '60%': { transform: 'translateY(-5px) scale(1.05)' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        // Storybook hotspot keyframes
        hopBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '15%': { transform: 'translateY(-40px)' },
          '30%': { transform: 'translateY(0)' },
          '45%': { transform: 'translateY(-22px)' },
          '60%': { transform: 'translateY(0)' },
          '75%': { transform: 'translateY(-8px)' },
          '90%': { transform: 'translateY(0)' },
        },
        hotspotPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.3)', opacity: '0.8' },
        },
        hotspotRipple: {
          '0%': { transform: 'scale(0.5)', opacity: '0.8' },
          '100%': { transform: 'scale(3)', opacity: '0' },
        },
        // Ellie storybook keyframes
        ellieFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        ellieGlow: {
          '0%, 100%': { boxShadow: '0 0 15px #facc15, 0 0 30px #facc15' },
          '50%': { boxShadow: '0 0 25px #facc15, 0 0 50px #facc15, 0 0 70px #facc15' },
        },
        ellieDriftIn: {
          '0%': { transform: 'translate(var(--drift-x), var(--drift-y)) scale(0.8)', opacity: '0' },
          '100%': { transform: 'translate(0, 0) scale(1)', opacity: '1' },
        },
        ellieShooAway: {
          '0%': { transform: 'rotate(0deg) scale(1)', opacity: '1' },
          '50%': { transform: 'rotate(180deg) scale(1.2)', opacity: '0.8' },
          '100%': { transform: 'rotate(360deg) scale(0) translateY(-100px)', opacity: '0' },
        },
        ellieBob: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-8px) scale(1.03)' },
        },
        ellieRipple: {
          '0%': { transform: 'scale(0.3)', opacity: '0.8', borderWidth: '4px' },
          '100%': { transform: 'scale(3)', opacity: '0', borderWidth: '1px' },
        },
        ellieMeterPulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        ellieSpinAway: {
          '0%': { transform: 'rotate(0deg) scale(1)', opacity: '1' },
          '100%': { transform: 'rotate(720deg) scale(0)', opacity: '0' },
        },
        ellieFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Inside Out keyframes
        ioJoyBounce: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '30%': { transform: 'translateY(-4px) rotate(1deg)' },
          '60%': { transform: 'translateY(-2px) rotate(-0.5deg)' },
        },
        ioAngerShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '75%': { transform: 'translateX(2px)' },
        },
        ioAnxietyJitter: {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(1px, -1px)' },
          '50%': { transform: 'translate(-1px, 1px)' },
          '75%': { transform: 'translate(1px, 0.5px)' },
          '100%': { transform: 'translate(0, 0)' },
        },
        ioSadnessSway: {
          '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
          '50%': { transform: 'translateX(3px) rotate(1deg)' },
        },
        ioFearTremble: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-1px)' },
        },
        ioFloatDrift: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-8px) translateX(3px)' },
          '75%': { transform: 'translateY(-4px) translateX(-3px)' },
        },
        ioGlowPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.08)' },
        },
        ioSlideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        ioSlideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        ioCountdownPop: {
          '0%': { transform: 'scale(2.5)', opacity: '0' },
          '40%': { transform: 'scale(0.9)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        ioSteamRise: {
          '0%': { transform: 'translateY(0) scale(0.5)', opacity: '0.6' },
          '100%': { transform: 'translateY(-40px) scale(1.5)', opacity: '0' },
        },
        ioEmberFloat: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.8' },
          '100%': { transform: 'translateY(-50px) translateX(15px) scale(0)', opacity: '0' },
        },
        ioOrbRoll: {
          '0%': { transform: 'translateX(-100px)' },
          '100%': { transform: 'translateX(calc(100% + 100px))' },
        },
        ioBreathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        ioSparkleSpin: {
          '0%': { transform: 'rotate(0deg)', opacity: '1' },
          '50%': { opacity: '0.5' },
          '100%': { transform: 'rotate(360deg)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
