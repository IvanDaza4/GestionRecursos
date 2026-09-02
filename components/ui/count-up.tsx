"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";

export function CountUp({
  value,
  className,
  suffix = "",
}: {
  value: number;
  className?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 30, stiffness: 90 });
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toLocaleString("es-AR") + suffix;
      }
    });
  }, [spring, suffix]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}
