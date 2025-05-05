import { ReactNode } from 'react';
import { useSwipeGesture } from '@hooks';

interface SwipeNavigationProps {
  children: ReactNode;
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
  minSwipeDistance = 75,
  maxVerticalOffset = 100,
  onReload,
  onGoBack,
}: SwipeNavigationProps) => {
  useSwipeGesture({
    onSwipeRight: onGoBack,
    onSwipeDown: onReload,
    minSwipeDistance,
    maxVerticalOffset,
    enabled: true,
  });

  return <>{children}</>;
};

export default SwipeNavigation;
