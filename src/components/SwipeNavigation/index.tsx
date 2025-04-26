import { ReactNode } from 'react';
import { useSwipeGesture } from '@hooks';

interface SwipeNavigationProps {
  children: ReactNode;
  canGoBack?: boolean;
  minSwipeDistance?: number;
  maxVerticalOffset?: number;
  onReload?: () => void;
  onGoBack?: () => void;
}

/**
 * Component that adds swipe navigation capabilities to its children
 * Swipe right to go back (if possible)
 */
const SwipeNavigation = ({
  children,
  canGoBack = true,
  minSwipeDistance = 75,
  maxVerticalOffset = 100,
  onReload,
  onGoBack,
}: SwipeNavigationProps) => {
  const handleSwipeRight = () => {
    if (canGoBack && window.history.length > 1) {
      onGoBack?.();
    }
  };

  useSwipeGesture({
    onSwipeRight: handleSwipeRight,
    onSwipeDown: onReload,
    minSwipeDistance,
    maxVerticalOffset,
    enabled: canGoBack,
  });

  return <>{children}</>;
};

export default SwipeNavigation;
