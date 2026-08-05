"use client";

import React, { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}

export default function RevealOnScroll({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: RevealOnScrollProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const tagProps: any = {
    ref,
    className: `${isVisible ? "animate-fade-in" : "opacity-0"} ${className}`,
    style: { animationDelay: `${delay}s` },
    children,
  };

  return React.createElement(Tag as any, tagProps);
}
