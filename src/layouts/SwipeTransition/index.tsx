import { ReactNode, useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import SwipeIndicator from './SwipeIndicator';
import BackgroundOverlay from './BackgroundOverlay';

interface SwipeTransitionProps {
  children: ReactNode;
  canGoBack?: boolean;
  minSwipeDistance?: number;
  maxVerticalOffset?: number;
}

/**
 * Component that adds animated swipe transition capabilities to its children
 * Swipe right to go back with animation (if possible)
 */
const SwipeTransition = ({
  children,
  canGoBack = true,
}: SwipeTransitionProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const previousPathRef = useRef<string>(location.pathname);

  // Handle entrance animation on first render and route changes
  useEffect(() => {
    setIsEntering(true);
    const timer = setTimeout(() => {
      setIsEntering(false);
    }, 300); // Match the animation duration

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Handle manual swipe for animated transition
  useEffect(() => {
    if (!containerRef.current || !canGoBack) return;

    const container = containerRef.current;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartXRef.current = e.touches[0].clientX;
      // Only apply this for touches that start near the left edge (within 30px)
      if (touchStartXRef.current > 30) {
        touchStartXRef.current = null;
      } else {
        // Swipe initiated from the left edge
        setIsSwipeActive(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartXRef.current === null) return;

      const currentX = e.touches[0].clientX;
      const deltaX = currentX - touchStartXRef.current;

      if (deltaX > 0) {
        // Only track right swipes
        const screenWidth = window.innerWidth;
        const progress = Math.min(deltaX / screenWidth, 1);
        setSwipeProgress(progress);

        // Apply real-time transform
        container.style.transform = `translateX(${deltaX}px)`;
        container.style.opacity = `${1 - progress * 0.3}`; // Fade slightly as it moves

        // Prevent default to stop scrolling when swiping
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartXRef.current === null) return;

      const currentX = e.changedTouches[0].clientX;
      const deltaX = currentX - touchStartXRef.current;

      // Reset styling
      container.style.transform = '';
      container.style.opacity = '';

      // If swipe is more than 30% of screen width, navigate back
      if (deltaX > window.innerWidth * 0.3) {
        if (window.history.length > 1) {
          setIsTransitioning(true);
          // Store the current path before navigating
          previousPathRef.current = location.pathname;
          // Use a setTimeout to allow the animation to start before navigation
          setTimeout(() => {
            navigate(-1);
          }, 10);
        }
      }

      setSwipeProgress(0);
      setIsSwipeActive(false);
      touchStartXRef.current = null;
    };

    container.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });
    container.addEventListener('touchmove', handleTouchMove, {
      passive: false,
    });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [canGoBack, navigate, location.pathname]);

  // Reset transition state when location changes
  useEffect(() => {
    if (previousPathRef.current !== location.pathname) {
      setIsTransitioning(false);
    }
    setSwipeProgress(0);
    setIsSwipeActive(false);
    previousPathRef.current = location.pathname;
  }, [location.pathname]);

  // Add haptic feedback if available
  useEffect(() => {
    if ('navigator' in window && 'vibrate' in navigator) {
      let hasVibrated = false;
      if (swipeProgress > 0.5 && !hasVibrated) {
        navigator.vibrate(10);
        hasVibrated = true;
      } else if (swipeProgress < 0.3) {
        hasVibrated = false;
      }
    }
  }, [swipeProgress]);

  return (
    <>
      <BackgroundOverlay progress={swipeProgress} active={isSwipeActive} />
      <SwipeIndicator progress={swipeProgress} active={isSwipeActive} />
      <div
        ref={containerRef}
        className={`w-full h-full transition-transform ${isTransitioning ? 'animate-slide-out' : ''} ${isEntering ? 'animate-slide-in' : ''}`}
        style={{
          touchAction: isSwipeActive ? 'none' : 'auto', // Prevent scrolling when swiping
        }}
      >
        {children}
      </div>
    </>
  );
};

export default SwipeTransition;
