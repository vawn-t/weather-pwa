import { useEffect, useRef } from 'react';

interface SwipeOptions {
  minSwipeDistance?: number;
  maxVerticalOffset?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  enabled?: boolean; // Whether the swipe detection is enabled
}

/**
 * Hook for detecting swipe gestures
 * @param options Configuration options for the swipe detection
 */
export const useSwipeGesture = ({
  minSwipeDistance = 50,
  maxVerticalOffset = 100,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  enabled = true,
}: SwipeOptions) => {
  const touchStartRef = useRef<Touch | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0];
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touchStart = touchStartRef.current;
      const touchEnd = e.changedTouches[0];

      // Calculate distance and direction
      const deltaX = touchEnd.clientX - touchStart.clientX;
      const deltaY = touchEnd.clientY - touchStart.clientY;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Detect horizontal swipe
      if (
        absX > absY &&
        absX >= minSwipeDistance &&
        absY <= maxVerticalOffset
      ) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }
      // Detect vertical swipe
      else if (absY > absX && absY >= minSwipeDistance) {
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }

      touchStartRef.current = null;
    };

    document.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [
    enabled,
    minSwipeDistance,
    maxVerticalOffset,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
  ]);
};
