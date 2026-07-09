export function HeroAtmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/40" />
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.28)_100%)]" />

      {/* Side glows removed (root cause of gold/cream vertical spill) */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.06] mix-blend-overlay">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {Array.from({ length: 16 }).map((_, i) => (
        <span
          key={i}
          className="absolute h-[3px] w-[3px] rounded-full bg-[#F6E6B4]/50"
          style={{
            left: `${(i * 41) % 100}%`,
            top: `${(i * 67) % 100}%`,
            animation: `breathe ${5 + (i % 4)}s ease-in-out ${i * 0.3}s infinite`,
          }}
        />
      ))}
    </div>
  );
}