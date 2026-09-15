"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  delayMs?: number;
  durationMs?: number;
  staggerChildrenMs?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  delayMs = 0,
  durationMs = 450,
  staggerChildrenMs = 70,
  className = "",
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        setIsVisible(true);
        return;
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, we unobserve to keep the rendered state stable
          if (containerRef.current) observer.unobserve(containerRef.current);
        }
      },
      { threshold: 0.15 }
    );

    const el = containerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  const childrenArray = React.Children.toArray(children);

  return (
    <div ref={containerRef} className={className}>
      {childrenArray.map((child, index) => {
        const itemDelay = delayMs + index * staggerChildrenMs;
        return (
          <div
            key={index}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0px)" : "translateY(10px)",
              transition: `opacity ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${itemDelay}ms, transform ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${itemDelay}ms`,
              willChange: "opacity, transform",
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
