"use client";

import { useEffect, useRef } from "react";

export default function InteractiveGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId = 0;
    let pendingX = 0;
    let pendingY = 0;

    const applyMousePosition = () => {
      container.style.setProperty("--mouse-x", `${pendingX}px`);
      container.style.setProperty("--mouse-y", `${pendingY}px`);
      rafId = 0;
    };

    const handleMouseMove = (e: MouseEvent) => {
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(applyMousePosition);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
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
          opacity: 0.1,
          maskImage: `radial-gradient(200px circle at var(--mouse-x) var(--mouse-y), black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(200px circle at var(--mouse-x) var(--mouse-y), black 0%, transparent 100%)`,
        }}
      />
    </div>
  );
}
