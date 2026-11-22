// Static SVG dev setup (monitor + keyboard). Animations are transform/opacity only; see .dev-* in globals.css.
const LINES = [
  { x: 30, w: 50 },
  { x: 38, w: 70 },
  { x: 38, w: 44 },
  { x: 46, w: 80 },
  { x: 30, w: 30 },
];
const ROWS = [
  { y: 112, n: 10 },
  { y: 122, n: 9 },
];

export default function DevArt() {
  return (
    <svg
      viewBox="0 0 200 150"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
      className="w-full max-w-[420px] animate-float text-foreground/70"
      role="img"
      aria-label="Developer workstation illustration"
    >
      <rect x="20" y="8" width="160" height="92" rx="6" />
      <path d="M90 100v8M110 100v8M80 108h40" />
      {LINES.map((l, i) => (
        <rect
          key={i}
          x={l.x}
          y={20 + i * 13}
          width={l.w}
          height="5"
          rx="2.5"
          fill="currentColor"
          stroke="none"
          fillOpacity=".5"
          className="dev-line"
          style={{ animationDelay: `${i * 0.7}s` }}
        />
      ))}
      <rect x="132" y="72" width="5" height="9" fill="currentColor" stroke="none" className="dev-cursor" />
      {ROWS.map((r) =>
        Array.from({ length: r.n }, (_, k) => (
          <rect
            key={`${r.y}-${k}`}
            x={(200 - (r.n * 14 - 3)) / 2 + k * 14}
            y={r.y}
            width="11"
            height="7"
            rx="1.5"
            strokeWidth="1.5"
            fill="currentColor"
            fillOpacity="0"
            className="dev-key"
            style={{ animationDelay: `${((k * 7 + r.y) % 11) * 0.27}s` }}
          />
        )),
      )}
      <rect x="52" y="132" width="96" height="7" rx="1.5" strokeWidth="1.5" />
    </svg>
  );
}
