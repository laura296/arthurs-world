export default function Sheep({ size = 160, className = '' }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className}>
      {/* Fluffy body (cloud of circles) */}
      <circle cx="80" cy="110" r="25" fill="#f0f0f0" />
      <circle cx="105" cy="100" r="28" fill="#f5f5f5" />
      <circle cx="130" cy="110" r="25" fill="#f0f0f0" />
      <circle cx="90" cy="125" r="24" fill="#e8e8e8" />
      <circle cx="115" cy="128" r="24" fill="#e8e8e8" />
      <circle cx="70" cy="120" r="20" fill="#ebebeb" />
      <circle cx="140" cy="120" r="20" fill="#ebebeb" />
      <circle cx="100" cy="115" r="28" fill="#f8f8f8" />
      {/* Head */}
      <ellipse cx="100" cy="60" rx="24" ry="22" fill="#3d3d3d" />
      {/* Fluffy top of head */}
      <circle cx="88" cy="40" r="10" fill="#f0f0f0" />
      <circle cx="100" cy="38" r="11" fill="#f5f5f5" />
      <circle cx="112" cy="40" r="10" fill="#f0f0f0" />
      {/* Ears */}
      <ellipse cx="72" cy="55" rx="12" ry="7" fill="#3d3d3d" transform="rotate(-15 72 55)" />
      <ellipse cx="128" cy="55" rx="12" ry="7" fill="#3d3d3d" transform="rotate(15 128 55)" />
      <ellipse cx="72" cy="55" rx="8" ry="4" fill="#e8a090" transform="rotate(-15 72 55)" />
      <ellipse cx="128" cy="55" rx="8" ry="4" fill="#e8a090" transform="rotate(15 128 55)" />
      {/* Eyes */}
      <circle cx="90" cy="58" r="5" fill="white" />
      <circle cx="110" cy="58" r="5" fill="white" />
      <circle cx="91" cy="59" r="3" fill="#2d2d2d" />
      <circle cx="111" cy="59" r="3" fill="#2d2d2d" />
      <circle cx="92" cy="57" r="1.2" fill="white" />
      <circle cx="112" cy="57" r="1.2" fill="white" />
      {/* Nose */}
      <ellipse cx="100" cy="70" rx="6" ry="4" fill="#555" />
      {/* Mouth */}
      <path d="M95 74 Q100 78 105 74" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" />
      {/* Cheeks */}
      <circle cx="82" cy="66" r="5" fill="#ffb0b0" opacity="0.4" />
      <circle cx="118" cy="66" r="5" fill="#ffb0b0" opacity="0.4" />
      {/* Legs */}
      <rect x="72" y="142" width="12" height="32" rx="6" fill="#3d3d3d" />
      <rect x="90" y="145" width="12" height="32" rx="6" fill="#3d3d3d" />
      <rect x="108" y="145" width="12" height="32" rx="6" fill="#3d3d3d" />
      <rect x="126" y="142" width="12" height="32" rx="6" fill="#3d3d3d" />
      {/* Hooves */}
      <ellipse cx="78" cy="174" rx="7" ry="4" fill="#2d2d2d" />
      <ellipse cx="96" cy="177" rx="7" ry="4" fill="#2d2d2d" />
      <ellipse cx="114" cy="177" rx="7" ry="4" fill="#2d2d2d" />
      <ellipse cx="132" cy="174" rx="7" ry="4" fill="#2d2d2d" />
    </svg>
  );
}
