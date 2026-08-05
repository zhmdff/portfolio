"use client";

import { useEffect, useRef, useState, type JSX, type ReactNode, type ComponentType, type Ref, type CSSProperties } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  id?: string;
}

export default function RevealOnScroll({
  children,
  delay = 0,
  className = "",
  as = "div",
  id,
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
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as as unknown as ComponentType<{
    ref?: Ref<HTMLElement>;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
    id?: string;
  }>;

  return (
    <Tag ref={ref} id={id} className={`${isVisible ? "animate-fade-in" : "opacity-0"} ${className}`} style={{ animationDelay: `${delay}s` }}>
      {children}
    </Tag>
  );
}
