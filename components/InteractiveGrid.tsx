"use client";

import { useEffect, useRef } from "react";

export default function InteractiveGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      container.style.setProperty("--mouse-x", `${clientX}px`);
      container.style.setProperty("--mouse-y", `${clientY}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden"
      style={{
        "--mouse-x": "50%",
        "--mouse-y": "50%",
      } as React.CSSProperties}
    >
      {/* Base Grid - Constant subtle lines */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(var(--grid-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Interactive Grid - Only the lines brighten around the mouse */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(var(--foreground) 1px, transparent 1px),
            linear-gradient(90deg, var(--foreground) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          opacity: 0.3, /* Increased opacity for the high-lighted part */
          maskImage: `radial-gradient(200px circle at var(--mouse-x) var(--mouse-y), black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(200px circle at var(--mouse-x) var(--mouse-y), black 0%, transparent 100%)`,
        }}
      />
    </div>
  );
}
