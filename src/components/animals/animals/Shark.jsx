export default function Shark({ size = 160, className = '' }) {
  return (
    <svg viewBox="0 0 220 220" width={size} height={size} className={className}>
      {/* Shadow beneath */}
      <ellipse cx="110" cy="205" rx="58" ry="8" fill="#2a3a5a" opacity="0.18" />

      {/* Tail fin — sweeping crescent */}
      <path d="M32 108 C18 88, 12 72, 8 56 C16 68, 24 76, 36 82Z" fill="#5a8aaf" />
      <path d="M32 118 C18 138, 12 152, 8 168 C16 156, 24 148, 36 140Z" fill="#5a8aaf" />
      {/* Tail fin highlights */}
      <path d="M28 102 C18 86, 14 76, 12 64 C18 74, 24 80, 32 86Z" fill="#6e9ec4" opacity="0.5" />
      <path d="M28 124 C18 140, 14 150, 12 160 C18 152, 24 146, 32 138Z" fill="#6e9ec4" opacity="0.5" />
      {/* Tail fin center connection */}
      <ellipse cx="36" cy="112" rx="8" ry="18" fill="#5a8aaf" />

      {/* Body — sleek rounded torpedo shape */}
      <path
        d="M36 112
           C36 78, 60 54, 100 48
           C130 44, 162 52, 180 68
           C198 84, 202 104, 198 118
           C194 132, 188 148, 172 160
           C156 172, 128 178, 100 176
           C68 172, 38 150, 36 112Z"
        fill="#5a8aaf"
      />

      {/* Body upper gradient layer — darker back */}
      <path
        d="M42 106
           C42 80, 64 58, 102 52
           C132 48, 160 56, 178 70
           C192 82, 196 98, 194 110
           C168 100, 136 92, 100 90
           C70 90, 48 96, 42 106Z"
        fill="#4a7494"
        opacity="0.6"
      />

      {/* Body shimmer highlight — top edge */}
      <path
        d="M60 72
           C80 60, 110 54, 140 56
           C160 58, 174 66, 182 74
           C170 68, 150 62, 130 60
           C108 58, 80 62, 60 72Z"
        fill="#8ab8d8"
        opacity="0.4"
      />

      {/* Belly — lighter underbelly */}
      <path
        d="M54 128
           C56 144, 72 160, 100 166
           C128 170, 152 164, 168 152
           C180 142, 188 130, 190 120
           C184 132, 170 150, 148 160
           C126 168, 80 166, 58 142
           C56 138, 54 132, 54 128Z"
        fill="#d8ecf4"
        opacity="0.85"
      />
      {/* Inner belly soft glow */}
      <ellipse cx="118" cy="148" rx="40" ry="18" fill="#e8f4fa" opacity="0.5" />

      {/* Belly line — separation between dark top and light belly */}
      <path
        d="M46 118
           C56 122, 80 130, 110 132
           C140 134, 166 128, 186 118"
        fill="none"
        stroke="#4a7494"
        strokeWidth="1"
        opacity="0.25"
      />

      {/* Dorsal fin — tall and proud on top */}
      <path
        d="M108 52
           C106 28, 118 8, 124 6
           C128 4, 130 16, 132 28
           C134 38, 136 46, 134 54
           C128 50, 118 48, 108 52Z"
        fill="#4a7a9e"
      />
      {/* Dorsal fin highlight */}
      <path
        d="M114 44
           C112 30, 120 14, 124 10
           C126 12, 126 22, 128 32
           C128 38, 130 44, 128 50
           C124 48, 118 46, 114 44Z"
        fill="#6a9abe"
        opacity="0.5"
      />

      {/* Left pectoral fin */}
      <path
        d="M80 130
           C68 140, 54 158, 48 172
           C52 170, 60 162, 68 152
           C74 144, 82 138, 86 132Z"
        fill="#5a8aaf"
      />
      <path
        d="M82 134
           C72 142, 62 156, 56 166
           C58 162, 64 154, 70 148
           C74 144, 80 138, 84 134Z"
        fill="#6e9ec4"
        opacity="0.45"
      />

      {/* Right pectoral fin */}
      <path
        d="M148 126
           C158 136, 170 152, 176 166
           C172 164, 166 156, 158 148
           C152 140, 146 134, 144 128Z"
        fill="#5a8aaf"
      />
      <path
        d="M150 130
           C158 138, 166 150, 170 160
           C168 158, 164 152, 158 146
           C154 140, 150 136, 148 132Z"
        fill="#6e9ec4"
        opacity="0.45"
      />

      {/* Small bottom anal fin */}
      <path d="M72 164 C68 174, 64 180, 60 184 C64 182, 70 176, 76 168Z" fill="#5a8aaf" />

      {/* Gill lines — three little curved lines */}
      <path d="M100 92 C98 100, 97 108, 98 116" fill="none" stroke="#4a7494" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <path d="M106 90 C104 98, 103 106, 104 114" fill="none" stroke="#4a7494" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <path d="M112 89 C110 97, 109 105, 110 113" fill="none" stroke="#4a7494" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />

      {/* Face area — slightly lighter muzzle */}
      <ellipse cx="172" cy="106" rx="28" ry="26" fill="#6a96b8" opacity="0.3" />

      {/* Eyes — BIG round sparkly adorable eyes */}
      {/* Left eye white */}
      <ellipse cx="150" cy="90" rx="16" ry="18" fill="white" stroke="#3a6a8a" strokeWidth="1.2" />
      {/* Right eye white */}
      <ellipse cx="180" cy="92" rx="14" ry="16" fill="white" stroke="#3a6a8a" strokeWidth="1.2" />

      {/* Left eye iris */}
      <circle cx="152" cy="92" r="10" fill="#1a5a78" />
      {/* Right eye iris */}
      <circle cx="182" cy="94" r="9" fill="#1a5a78" />

      {/* Left eye pupil */}
      <circle cx="153" cy="93" r="6" fill="#0a1a28" />
      {/* Right eye pupil */}
      <circle cx="183" cy="95" r="5.5" fill="#0a1a28" />

      {/* Eye ring detail — inner color */}
      <circle cx="152" cy="92" r="10" fill="none" stroke="#2a7aa0" strokeWidth="1.5" opacity="0.4" />
      <circle cx="182" cy="94" r="9" fill="none" stroke="#2a7aa0" strokeWidth="1.5" opacity="0.4" />

      {/* Left eye sparkle highlights */}
      <circle cx="156" cy="87" r="4" fill="white" />
      <circle cx="148" cy="96" r="2.2" fill="white" opacity="0.7" />
      <circle cx="155" cy="83" r="1.5" fill="white" opacity="0.5" />

      {/* Right eye sparkle highlights */}
      <circle cx="186" cy="89" r="3.5" fill="white" />
      <circle cx="179" cy="98" r="2" fill="white" opacity="0.7" />
      <circle cx="185" cy="86" r="1.3" fill="white" opacity="0.5" />

      {/* Cute little eyebrows — friendly arched */}
      <path d="M137 78 C143 73, 157 72, 164 76" fill="none" stroke="#3a6080" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M170 80 C176 76, 188 76, 194 80" fill="none" stroke="#3a6080" strokeWidth="2.2" strokeLinecap="round" />

      {/* Nose — cute little nostrils */}
      <circle cx="196" cy="102" r="2" fill="#3a6a88" />
      <circle cx="200" cy="106" r="1.8" fill="#3a6a88" />

      {/* Happy smile — wide and friendly with little teeth */}
      <path
        d="M158 118 C164 126, 178 130, 196 124"
        fill="none"
        stroke="#3a5a78"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Smile interior — open happy mouth */}
      <path
        d="M162 120 C168 126, 180 128, 192 124"
        fill="#c44060"
        opacity="0.6"
      />
      {/* Tiny cute teeth — not scary! */}
      <path d="M164 120 L166 124 L168 120" fill="white" opacity="0.85" />
      <path d="M172 121 L174 125.5 L176 121.5" fill="white" opacity="0.85" />
      <path d="M180 122 L182 126 L184 122" fill="white" opacity="0.85" />
      <path d="M188 121 L189.5 124.5 L191 121" fill="white" opacity="0.85" />

      {/* Rosy cheek blush circles — so cute! */}
      <circle cx="142" cy="108" r="9" fill="#e8788a" opacity="0.3" />
      <circle cx="196" cy="114" r="8" fill="#e8788a" opacity="0.3" />

      {/* Little heart on the side — extra cute detail for Arthur */}
      <path
        d="M80 82
           C80 78, 84 74, 88 78
           C92 74, 96 78, 96 82
           C96 88, 88 94, 88 94
           C88 94, 80 88, 80 82Z"
        fill="#e86888"
        opacity="0.5"
      />

      {/* Tiny star sparkle near the tail — magical storybook detail */}
      <path
        d="M52 80 L54 76 L56 80 L60 80 L57 83 L58 87 L54 84 L50 87 L51 83 L48 80Z"
        fill="#f8d878"
        opacity="0.55"
      />

      {/* Second tiny sparkle star near dorsal fin */}
      <path
        d="M140 26 L141.5 22 L143 26 L147 26 L144 28.5 L145 32 L141.5 30 L138 32 L139 28.5 L136 26Z"
        fill="#f8d878"
        opacity="0.45"
      />

      {/* Body top rim light — shiny wet look */}
      <path
        d="M64 70
           C84 58, 112 52, 140 54
           C158 56, 172 64, 182 72"
        fill="none"
        stroke="#a0d0e8"
        strokeWidth="1.5"
        opacity="0.35"
        strokeLinecap="round"
      />
    </svg>
  );
}
