import { useState, useEffect } from 'react';

const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface UseCountUpOptions {
  duration?: number;
  start?: number;
  decimals?: number;
}

export function useCountUp(
  end: number,
  options: UseCountUpOptions = {}
) {
  const { duration = 2000, start = 0, decimals = 0 } = options;
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (prefersReducedMotion) {
      setCount(end);
      return;
    }

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = start + (end - start) * easeOutQuart;
      
      if (decimals > 0) {
        setCount(Number(currentCount.toFixed(decimals)));
      } else {
        setCount(Math.floor(currentCount));
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, start, decimals]);

  return count;
}

