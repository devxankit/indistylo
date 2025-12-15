import type { Variants } from 'framer-motion';

// Check for reduced motion preference
const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Base transition presets
export const transitions = {
  smooth: {
    type: 'tween' as const,
    ease: [0.4, 0, 0.2, 1],
    duration: prefersReducedMotion ? 0 : 0.3,
  },
  spring: {
    type: 'spring' as const,
    damping: 25,
    stiffness: 200,
    duration: prefersReducedMotion ? 0 : 0.4,
  },
  quick: {
    type: 'tween' as const,
    ease: [0.4, 0, 0.2, 1],
    duration: prefersReducedMotion ? 0 : 0.2,
  },
};

// Fade in animation variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: transitions.smooth,
  },
};

// Slide up animation variants
export const slideUp: Variants = {
  hidden: { 
    opacity: 0,
    y: prefersReducedMotion ? 0 : 20,
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
};

// Scale animation variants
export const scale: Variants = {
  hidden: { 
    opacity: 0,
    scale: prefersReducedMotion ? 1 : 0.95,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: transitions.smooth,
  },
};

// Stagger container variants
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: prefersReducedMotion ? 0 : 0.1,
      delayChildren: prefersReducedMotion ? 0 : 0.1,
    },
  },
};

// Stagger item variants
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.smooth,
  },
};


// Touch feedback scale
export const touchScale = {
  scale: prefersReducedMotion ? 1 : 0.98,
  transition: transitions.quick,
};

// Hover lift effect
export const hoverLift = {
  y: prefersReducedMotion ? 0 : -2,
  transition: transitions.quick,
};

