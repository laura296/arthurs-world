export default function Cow({ size = 160, className = '' }) {
  return (
    <svg viewBox="0 0 220 220" width={size} height={size} className={className}>
      <defs>
        <filter id="cow-soft" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
        </filter>
      </defs>

      {/* Shadow on ground */}
      <ellipse cx="110" cy="208" rx="55" ry="8" fill="#2a5a2a" opacity="0.25" />

      {/* Tail — whippy with tuft */}
      <path d="M42 125 C30 108, 22 88, 30 72" fill="none" stroke="#e8e0d8" strokeWidth="4" strokeLinecap="round" />
      <path d="M30 72 C26 65, 32 58, 28 52" fill="none" stroke="#5c4a3a" strokeWidth="6" strokeLinecap="round" />

      {/* Body — big soft blobby shape */}
      <path d="M52 132 C48 98, 68 78, 110 76 C152 78, 172 98, 168 132 C165 160, 148 174, 110 176 C72 174, 55 160, 52 132Z" fill="#f5efe8" />
      <path d="M60 138 C58 112, 74 96, 110 94 C146 96, 162 112, 160 138 C158 158, 144 166, 110 168 C76 166, 62 158, 60 138Z" fill="#ece4da" opacity="0.6" />

      {/* Spots — wobbly organic blobs */}
      <path d="M70 110 C66 100, 78 92, 90 98 C96 104, 92 118, 82 120 C72 122, 72 116, 70 110Z" fill="#5c4a3a" opacity="0.85" />
      <path d="M122 128 C120 118, 132 112, 142 118 C148 126, 142 140, 132 142 C122 144, 124 134, 122 128Z" fill="#5c4a3a" opacity="0.85" />
      <path d="M96 145 C94 138, 104 132, 112 138 C116 144, 110 152, 103 154 C96 154, 96 150, 96 145Z" fill="#5c4a3a" opacity="0.7" />

      {/* Udder */}
      <ellipse cx="110" cy="170" rx="12" ry="7" fill="#f0c0b8" />

      {/* Legs — chunky, slightly wobbly, storybook style */}
      <path d="M74 162 C72 172, 69 185, 67 196 L78 198 C79 188, 80 176, 80 166Z" fill="#f5efe8" stroke="#d8cec0" strokeWidth="1" />
      <path d="M92 166 C90 178, 88 190, 87 198 L98 200 C98 192, 98 180, 97 170Z" fill="#f5efe8" stroke="#d8cec0" strokeWidth="1" />
      <path d="M124 166 C123 178, 122 190, 121 198 L132 200 C132 192, 132 180, 130 170Z" fill="#ece4da" stroke="#d8cec0" strokeWidth="1" />
      <path d="M146 162 C145 172, 143 185, 141 196 L152 198 C152 188, 151 176, 149 166Z" fill="#ece4da" stroke="#d8cec0" strokeWidth="1" />

      {/* Hooves — rounded */}
      <path d="M64 196 C62 202, 80 204, 80 198Z" fill="#5c4a3a" />
      <path d="M84 198 C82 204, 100 206, 100 200Z" fill="#5c4a3a" />
      <path d="M118 198 C116 204, 134 206, 134 200Z" fill="#5c4a3a" />
      <path d="M138 196 C136 202, 154 204, 154 198Z" fill="#5c4a3a" />

      {/* Head — big round friendly face */}
      <path d="M72 65 C68 38, 86 18, 110 16 C134 18, 152 38, 148 65 C146 88, 132 100, 110 102 C88 100, 74 88, 72 65Z" fill="#f5efe8" stroke="#d8cec0" strokeWidth="1.5" />

      {/* Ears — soft droopy */}
      <path d="M76 40 C62 28, 46 34, 50 48 C53 58, 64 58, 74 50Z" fill="#f5efe8" stroke="#d8cec0" strokeWidth="1" />
      <path d="M68 42 C60 35, 54 38, 56 47 C57 52, 62 53, 68 49Z" fill="#e8a898" />
      <path d="M144 40 C158 28, 174 34, 170 48 C167 58, 156 58, 146 50Z" fill="#f5efe8" stroke="#d8cec0" strokeWidth="1" />
      <path d="M152 42 C160 35, 166 38, 164 47 C163 52, 158 53, 152 49Z" fill="#e8a898" />

      {/* Horns — small, warm, rounded */}
      <path d="M82 28 C76 14, 68 12, 66 18" fill="none" stroke="#d8b050" strokeWidth="6" strokeLinecap="round" />
      <path d="M138 28 C144 14, 152 12, 154 18" fill="none" stroke="#d8b050" strokeWidth="6" strokeLinecap="round" />

      {/* Eyes — HUGE, soulful, storybook expressive */}
      <ellipse cx="94" cy="56" rx="14" ry="16" fill="white" stroke="#c8b8a0" strokeWidth="1" />
      <ellipse cx="126" cy="56" rx="14" ry="16" fill="white" stroke="#c8b8a0" strokeWidth="1" />
      <circle cx="96" cy="58" r="9" fill="#5a3820" />
      <circle cx="128" cy="58" r="9" fill="#5a3820" />
      <circle cx="97" cy="56" r="5" fill="#2a1808" />
      <circle cx="129" cy="56" r="5" fill="#2a1808" />
      {/* Eye shine — two highlights per eye for that storybook sparkle */}
      <circle cx="100" cy="52" r="4" fill="white" />
      <circle cx="132" cy="52" r="4" fill="white" />
      <circle cx="93" cy="60" r="2" fill="white" opacity="0.7" />
      <circle cx="125" cy="60" r="2" fill="white" opacity="0.7" />
      {/* Eyebrows — gentle, expressive */}
      <path d="M80 42 C86 37, 100 37, 108 42" fill="none" stroke="#8a7a68" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M112 42 C120 37, 134 37, 140 42" fill="none" stroke="#8a7a68" strokeWidth="2.5" strokeLinecap="round" />

      {/* Snout — big, soft, pink */}
      <path d="M86 74 C84 64, 94 58, 110 58 C126 58, 136 64, 134 74 C132 86, 124 92, 110 92 C96 92, 88 86, 86 74Z" fill="#f2baa8" stroke="#daa090" strokeWidth="1.5" />
      <ellipse cx="100" cy="76" rx="5" ry="6" fill="#d09080" />
      <ellipse cx="120" cy="76" rx="5" ry="6" fill="#d09080" />

      {/* Mouth — warm friendly smile */}
      <path d="M100 86 C106 92, 114 92, 120 86" fill="none" stroke="#b87868" strokeWidth="2.5" strokeLinecap="round" />

      {/* Cowbell on ribbon */}
      <path d="M100 100 L110 96 L120 100" fill="none" stroke="#c83838" strokeWidth="3" strokeLinecap="round" />
      <rect x="102" y="98" width="16" height="14" rx="4" fill="#e8c840" stroke="#c8a830" strokeWidth="1.5" />
      <circle cx="110" cy="108" r="2.5" fill="#b89828" />

      {/* Cheek blush */}
      <ellipse cx="74" cy="68" rx="8" ry="5" fill="#f0a898" opacity="0.4" />
      <ellipse cx="146" cy="68" rx="8" ry="5" fill="#f0a898" opacity="0.4" />
    </svg>
  );
}
