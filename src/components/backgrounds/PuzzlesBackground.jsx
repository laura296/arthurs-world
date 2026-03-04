export default function PuzzlesBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-teal-900 to-cyan-950">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(30deg, #2dd4bf 12%, transparent 12.5%, transparent 87%, #2dd4bf 87.5%, #2dd4bf),
            linear-gradient(150deg, #2dd4bf 12%, transparent 12.5%, transparent 87%, #2dd4bf 87.5%, #2dd4bf),
            linear-gradient(30deg, #2dd4bf 12%, transparent 12.5%, transparent 87%, #2dd4bf 87.5%, #2dd4bf),
            linear-gradient(150deg, #2dd4bf 12%, transparent 12.5%, transparent 87%, #2dd4bf 87.5%, #2dd4bf)
          `,
          backgroundSize: '80px 140px',
          backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px',
        }}
      />
      {[
        { x: '10%', y: '20%', size: 40, color: '#2dd4bf', delay: 0 },
        { x: '70%', y: '15%', size: 30, color: '#f87171', delay: 1 },
        { x: '85%', y: '60%', size: 35, color: '#c4b5fd', delay: 2 },
        { x: '25%', y: '70%', size: 28, color: '#2dd4bf', delay: 0.5 },
        { x: '55%', y: '40%', size: 32, color: '#f87171', delay: 1.5 },
      ].map((s, i) => (
        <div
          key={i}
          className="absolute rounded-lg opacity-15 animate-float"
          style={{
            left: s.x, top: s.y,
            width: s.size, height: s.size,
            backgroundColor: s.color,
            animationDelay: `${s.delay}s`,
            transform: `rotate(${45 * i}deg)`,
          }}
        />
      ))}
    </div>
  );
}
