// Static SVG gamepad; replaces the WebGL model. Float animation is transform-only (compositor, no main-thread cost).
export default function ControllerArt() {
  return (
    <div className="controller-canvas-wrapper flex items-center justify-center">
      <svg
        viewBox="0 0 200 140"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        className="w-full animate-float text-foreground/70"
        role="img"
        aria-label="Game controller illustration"
      >
        <path
          pathLength={1}
          className="pad-body"
          d="M60 30h80c22 0 34 20 40 52 4 22-2 38-16 38-12 0-18-12-28-24H64c-10 12-16 24-28 24-14 0-20-16-16-38 6-32 18-52 40-52Z"
        />
        <path className="pad-dpad" d="M52 62v20M42 72h20" strokeWidth="3" />
        <circle
          cx="146"
          cy="62"
          r="4"
          className="pad-btn"
          style={{ animationDelay: "0.0s" }}
        />
        <circle
          cx="158"
          cy="74"
          r="4"
          className="pad-btn"
          style={{ animationDelay: "0.5s" }}
        />
        <circle
          cx="134"
          cy="74"
          r="4"
          className="pad-btn"
          style={{ animationDelay: "1.5s" }}
        />
        <circle
          cx="146"
          cy="86"
          r="4"
          className="pad-btn"
          style={{ animationDelay: "1.0s" }}
        />
        <circle cx="88" cy="88" r="9" className="pad-stick" />
        <circle
          cx="112"
          cy="88"
          r="9"
          className="pad-stick"
          style={{ animationDelay: "-2s" }}
        />
        <path d="M90 44h20" strokeOpacity=".5" />
      </svg>
    </div>
  );
}
