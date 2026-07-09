export function WavyDivider() {
  return (
    <svg
      viewBox="0 0 300 20"
      className="h-4 w-full max-w-xs text-gold/45"
      fill="none"
      preserveAspectRatio="none"
    >
      <path
        d="M0 10 Q 25 0, 50 10 T 100 10 T 150 10 T 200 10 T 250 10 T 300 10"
        stroke="currentColor"
        strokeWidth="1"
      />
      {[20, 80, 140, 200, 260].map((x) => (
        <circle key={x} cx={x} cy={10 + (x % 40 === 20 ? -3 : 3)} r="1.4" fill="currentColor" />
      ))}
    </svg>
  );
}