import { ReactNode, useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router';
import classNames from 'classnames';

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
const SwipeTransition = ({ children }: SwipeTransitionProps) => {
  const location = useLocation();
  const [isEntering, setIsEntering] = useState(true);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const previousPathRef = useRef<string>(location.pathname);

  // Handle entrance animation on first render and route changes
  useEffect(() => {
    setIsEntering(true);
    const timer = setTimeout(() => {
      setIsEntering(false);
    }, 300); // Match the animation duration

    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    setIsSwipeActive(false);
    previousPathRef.current = location.pathname;
  }, [location.pathname]);

  return (
    <div
      ref={containerRef}
      className={classNames('w-full h-full', { 'animate-fade-in': isEntering })}
      style={{
        touchAction: isSwipeActive ? 'none' : 'auto', // Prevent scrolling when swiping
      }}
    >
      {children}
    </div>
  );
};

export default SwipeTransition;
