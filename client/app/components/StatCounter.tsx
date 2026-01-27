"use client";

import { animate, useInView, useMotionValue, useTransform, motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function StatCounter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      animate(count, to, { duration: 2, ease: "easeOut" });
    }
  }, [count, isInView, to]);

  return (
    <span ref={ref}>
      {/* FIX: Wrap the 'rounded' motion value in a <motion.span>. 
        This allows it to render the live value without the "Object error".
      */}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}