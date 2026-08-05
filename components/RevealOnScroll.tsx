"use client";

import { useEffect, useRef, useState, type ReactNode, type ElementType, type ComponentType, type Ref, type CSSProperties } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
}

export default function RevealOnScroll({
  children,
  delay = 0,
  className = "",
  as = "div",
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

  const Tag = as as unknown as ComponentType<{
    ref?: Ref<HTMLElement>;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
  }>;

  return (
    <Tag ref={ref} className={`${isVisible ? "animate-fade-in" : "opacity-0"} ${className}`} style={{ animationDelay: `${delay}s` }}>
      {children}
    </Tag>
  );
}
