"use client";

import { animate, useInView, useMotionValue, useTransform, motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function StatCounter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  
  // 'once: false' allows the animation to re-trigger every time it enters the view
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      // Animate up to the target number when in view
      animate(count, to, { duration: 2, ease: "easeOut" });
    } else {
      // Reset to 0 when out of view so it can animate again next time
      count.set(0);
    }
  }, [count, isInView, to]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}