export default function Pig({ size = 160, className = '' }) {
  return (
    <svg viewBox="0 0 220 220" width={size} height={size} className={className}>
      {/* Shadow */}
      <ellipse cx="110" cy="208" rx="52" ry="7" fill="#4a2a2a" opacity="0.2" />

      {/* Tail — curly corkscrew */}
      <path d="M44 115 C32 108, 28 96, 34 88 C40 80, 36 72, 32 68" fill="none" stroke="#f0a0a8" strokeWidth="5" strokeLinecap="round" />

      {/* Body — big round blobby */}
      <path d="M52 128 C48 96, 70 78, 110 76 C150 78, 172 96, 168 128 C166 158, 148 172, 110 174 C72 172, 54 158, 52 128Z" fill="#f8b4be" />
      <path d="M62 135 C60 110, 78 96, 110 94 C142 96, 160 110, 158 135 C156 155, 142 164, 110 166 C78 164, 64 155, 62 135Z" fill="#fcc4cc" opacity="0.7" />

      {/* Belly highlight */}
      <ellipse cx="110" cy="145" rx="32" ry="20" fill="#fdd4d8" opacity="0.6" />

      {/* Legs */}
      <path d="M74 162 C72 174, 70 188, 68 198 L80 200 C80 190, 80 178, 80 168Z" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" />
      <path d="M94 166 C92 178, 90 190, 89 200 L101 202 C100 192, 99 180, 98 170Z" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" />
      <path d="M120 166 C119 178, 118 190, 117 200 L129 202 C128 192, 128 180, 126 170Z" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
      <path d="M142 162 C141 174, 140 188, 138 198 L150 200 C150 190, 149 178, 147 168Z" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />

      {/* Hooves */}
      <path d="M65 198 C64 204, 82 206, 82 200Z" fill="#d88898" />
      <path d="M86 200 C85 206, 103 208, 103 202Z" fill="#d88898" />
      <path d="M114 200 C113 206, 131 208, 131 202Z" fill="#d88898" />
      <path d="M135 198 C134 204, 152 206, 152 200Z" fill="#d88898" />

      {/* Head — big and round and cheeky */}
      <circle cx="110" cy="60" r="42" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1.5" />

      {/* Ears — big floppy triangular */}
      <path d="M74 36 C60 12, 46 18, 52 36 C56 46, 66 48, 74 42Z" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" />
      <path d="M64 30 C56 18, 52 22, 55 34 C57 40, 62 42, 66 38Z" fill="#e89098" />
      <path d="M146 36 C160 12, 174 18, 168 36 C164 46, 154 48, 146 42Z" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" />
      <path d="M156 30 C164 18, 168 22, 165 34 C163 40, 158 42, 154 38Z" fill="#e89098" />

      {/* Eyes — big round sparkly */}
      <ellipse cx="92" cy="52" rx="13" ry="15" fill="white" stroke="#d8a0a8" strokeWidth="1" />
      <ellipse cx="128" cy="52" rx="13" ry="15" fill="white" stroke="#d8a0a8" strokeWidth="1" />
      <circle cx="94" cy="54" r="8" fill="#4a2828" />
      <circle cx="130" cy="54" r="8" fill="#4a2828" />
      <circle cx="95" cy="52" r="4.5" fill="#1a0808" />
      <circle cx="131" cy="52" r="4.5" fill="#1a0808" />
      <circle cx="98" cy="48" r="3.5" fill="white" />
      <circle cx="134" cy="48" r="3.5" fill="white" />
      <circle cx="92" cy="56" r="1.8" fill="white" opacity="0.6" />
      <circle cx="128" cy="56" r="1.8" fill="white" opacity="0.6" />

      {/* Eyebrows */}
      <path d="M80 40 C86 35, 100 35, 106 40" fill="none" stroke="#c08088" strokeWidth="2" strokeLinecap="round" />
      <path d="M114 40 C120 35, 134 35, 140 40" fill="none" stroke="#c08088" strokeWidth="2" strokeLinecap="round" />

      {/* Snout — BIG round pink disc */}
      <ellipse cx="110" cy="74" rx="22" ry="16" fill="#f0909a" stroke="#d87888" strokeWidth="1.5" />
      <ellipse cx="102" cy="74" rx="5" ry="6" fill="#c87078" />
      <ellipse cx="118" cy="74" rx="5" ry="6" fill="#c87078" />

      {/* Mouth */}
      <path d="M100 86 C106 92, 114 92, 120 86" fill="none" stroke="#c06878" strokeWidth="2.5" strokeLinecap="round" />

      {/* Cheek blush — rosy circles */}
      <circle cx="70" cy="62" r="10" fill="#f8909a" opacity="0.35" />
      <circle cx="150" cy="62" r="10" fill="#f8909a" opacity="0.35" />
    </svg>
  );
}
