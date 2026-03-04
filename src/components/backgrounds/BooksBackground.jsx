export default function BooksBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg viewBox="0 0 800 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="booksBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#451a03" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <radialGradient id="lampGlow" cx="50%" cy="30%" r="40%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="800" height="600" fill="url(#booksBg)" />
        <circle cx="400" cy="150" r="250" fill="url(#lampGlow)">
          <animate attributeName="r" values="250;260;245;255;250" dur="5s" repeatCount="indefinite" />
        </circle>
        <rect x="50" y="150" width="700" height="8" fill="#92400e" rx="2" />
        <rect x="50" y="300" width="700" height="8" fill="#92400e" rx="2" />
        <rect x="50" y="450" width="700" height="8" fill="#92400e" rx="2" />
        {[
          { x: 60, w: 20, h: 90, color: '#dc2626' },
          { x: 85, w: 18, h: 85, color: '#2563eb' },
          { x: 108, w: 22, h: 95, color: '#16a34a' },
          { x: 135, w: 16, h: 80, color: '#9333ea' },
          { x: 156, w: 24, h: 92, color: '#ea580c' },
          { x: 185, w: 19, h: 88, color: '#0891b2' },
          { x: 330, w: 21, h: 90, color: '#be123c' },
          { x: 356, w: 17, h: 82, color: '#4f46e5' },
          { x: 378, w: 23, h: 94, color: '#15803d' },
        ].map((book, i) => (
          <rect key={i} x={book.x} y={150 - book.h} width={book.w} height={book.h} fill={book.color} opacity="0.3" rx="2" />
        ))}
        <rect x="0" y="500" width="800" height="100" fill="#3f1e04" />
        <rect x="0" y="498" width="800" height="6" fill="#5c2d0a" />
      </svg>
    </div>
  );
}
