"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  end?: number;
  value?: number;
  start?: number;
  duration?: number; // ms, default 1000ms
  prefix?: string;
  suffix?: string;
  decimals?: number;
  formatIndian?: boolean;
  isCurrency?: boolean;
  className?: string;
}

export function CountUp({
  end,
  value: valProp,
  prefix = "",
  suffix = "",
  decimals = 0,
  formatIndian = true,
  className = "",
}: CountUpProps) {
  const targetEnd = typeof end === "number" ? end : typeof valProp === "number" ? valProp : 0;

  const formatNumber = (numVal: number) => {
    const fixed = numVal.toFixed(decimals);
    const num = Number(fixed);
    if (formatIndian) {
      return num.toLocaleString("en-IN", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    }
    return fixed;
  };

  return (
    <span
      className={`tabular-nums inline-block font-mono tracking-tight ${className}`}
      data-tabular="true"
    >
      {prefix}
      {formatNumber(targetEnd)}
      {suffix}
    </span>
  );
}

export default CountUp;
