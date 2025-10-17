'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
}

export default function AnimatedCounter({ value }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest).toLocaleString('id-ID'));
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const animation = animate(count, value, { duration: 1.5, ease: 'easeOut' });
      return animation.stop;
    }
  }, [isInView, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}