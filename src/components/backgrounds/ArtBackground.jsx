export default function ArtBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-rose-950 to-pink-950">
      <svg viewBox="0 0 800 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMax slice">
        <circle cx="150" cy="120" r="80" fill="#ec4899" opacity="0.15" />
        <circle cx="650" cy="100" r="100" fill="#8b5cf6" opacity="0.12" />
        <circle cx="400" cy="450" r="120" fill="#f59e0b" opacity="0.1" />
        <circle cx="100" cy="400" r="70" fill="#22c55e" opacity="0.12" />
        <circle cx="700" cy="350" r="90" fill="#38bdf8" opacity="0.1" />
        <rect x="300" y="0" width="8" height="60" rx="4" fill="#ec4899" opacity="0.2">
          <animate attributeName="height" values="0;60;60" dur="8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.2;0.15" dur="8s" repeatCount="indefinite" />
        </rect>
        <rect x="550" y="0" width="6" height="45" rx="3" fill="#8b5cf6" opacity="0.15">
          <animate attributeName="height" values="0;45;45" dur="12s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.15;0.1" dur="12s" repeatCount="indefinite" />
        </rect>
        <path d="M50 550 Q200 520 350 540 Q500 525 650 545 Q730 535 800 550" stroke="#ec4899" strokeWidth="20" fill="none" opacity="0.08" strokeLinecap="round" />
        <path d="M0 570 Q150 545 300 565 Q500 540 700 560 Q770 555 800 570" stroke="#f59e0b" strokeWidth="15" fill="none" opacity="0.06" strokeLinecap="round" />
      </svg>
    </div>
  );
}
