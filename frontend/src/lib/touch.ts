import { useState, useRef, useEffect, TouchEvent, MouseEvent } from 'react';

// Swipe direction type
export type SwipeDirection = 'left' | 'right' | 'up' | 'down' | null;

// Swipe hook configuration
interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number; // Minimum distance in pixels to trigger swipe
  preventScroll?: boolean; // Prevent default scroll behavior
}

// Hook for detecting swipe gestures
export function useSwipe(options: UseSwipeOptions = {}) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    preventScroll = false,
  } = options;

  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);

  const minSwipeDistance = threshold;

  const onTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    touchEnd.current = null;
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchMove = (e: TouchEvent) => {
    if (preventScroll) {
      e.preventDefault();
    }
    const touch = e.touches[0];
    touchEnd.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;

    const distanceX = touchStart.current.x - touchEnd.current.x;
    const distanceY = touchStart.current.y - touchEnd.current.y;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isUpSwipe = distanceY > minSwipeDistance;
    const isDownSwipe = distanceY < -minSwipeDistance;

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      // Horizontal swipe
      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft();
      }
      if (isRightSwipe && onSwipeRight) {
        onSwipeRight();
      }
    } else {
      // Vertical swipe
      if (isUpSwipe && onSwipeUp) {
        onSwipeUp();
      }
      if (isDownSwipe && onSwipeDown) {
        onSwipeDown();
      }
    }

    touchStart.current = null;
    touchEnd.current = null;
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}

// Touch feedback hook - provides active state for touch interactions
export function useTouchFeedback() {
  const [isActive, setIsActive] = useState(false);

  const onTouchStart = () => setIsActive(true);
  const onTouchEnd = () => {
    setTimeout(() => setIsActive(false), 150);
  };

  return {
    isActive,
    onTouchStart,
    onTouchEnd,
  };
}

// Haptic feedback helper (for supported devices)
export function triggerHapticFeedback(type: 'light' | 'medium' | 'heavy' = 'light') {
  if ('vibrate' in navigator) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30,
    };
    navigator.vibrate(patterns[type]);
  }
}

// Long press hook
export function useLongPress(
  callback: () => void,
  ms: number = 500
) {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const target = useRef<EventTarget | null>(null);

  const start = (event: TouchEvent | MouseEvent) => {
    if (event.target) {
      target.current = event.target;
    }
    timeout.current = setTimeout(() => {
      callback();
      setLongPressTriggered(true);
      triggerHapticFeedback('medium');
    }, ms);
  };

  const clear = () => {
    timeout.current && clearTimeout(timeout.current);
    setLongPressTriggered(false);
  };

  return {
    onMouseDown: (e: MouseEvent) => start(e),
    onTouchStart: (e: TouchEvent) => start(e),
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchEnd: clear,
  };
}

