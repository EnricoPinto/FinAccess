"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedProgressProps {
  value: number; // 0 to 100
  max?: number;
  heightClass?: string; // e.g. "h-2" or "h-1.5"
  barColor?: string; // e.g. "bg-blueprintBlue" or custom color
  useSweep?: boolean;
  className?: string;
}

export function AnimatedProgress({
  value,
  max = 100,
  heightClass = "h-2",
  barColor = "bg-blueprintBlue",
  useSweep = true,
  className = "",
}: AnimatedProgressProps) {
  const [fillPercent, setFillPercent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const targetPercent = Math.min(Math.max((value / max) * 100, 0), 100);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        setFillPercent(targetPercent);
        return;
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Trigger smooth ease-out fill
          setFillPercent(targetPercent);
        }
      },
      { threshold: 0.1 }
    );

    const el = containerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [targetPercent]);

  return (
    <div
      ref={containerRef}
      className={`w-full bg-white/[0.04] border border-glassEdge rounded-full overflow-hidden ${heightClass} ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${
          useSweep ? "progress-sweep" : barColor
        }`}
        style={{
          width: `${fillPercent}%`,
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </div>
  );
}

export default AnimatedProgress;
