import {
  useState,
  useRef,
  useEffect,
  ReactNode,
  TouchEvent,
  memo,
} from 'react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  pullDownThreshold?: number;
  maxPullDownDistance?: number;
}

const PullToRefresh = ({
  children,
  onRefresh,
  pullDownThreshold = 80,
  maxPullDownDistance = 120,
}: PullToRefreshProps) => {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number | null>(null);
  const containerScrollTop = useRef<number>(0);

  useEffect(() => {
    // Reset after refreshing completes
    if (isRefreshing) {
      const timer = setTimeout(() => {
        setPullDistance(0);
        setIsRefreshing(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isRefreshing]);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startYRef.current = e.touches[0].clientY;
      containerScrollTop.current = containerRef.current.scrollTop;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isPulling || startYRef.current === null) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;

    // Only allow pulling down, not up
    if (diff > 0) {
      // Apply resistance factor for natural feeling
      const distance = Math.min(diff * 0.5, maxPullDownDistance);
      setPullDistance(distance);

      // Prevent default to avoid scroll bounce on iOS
      if (containerRef.current && containerRef.current.scrollTop === 0) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;

    if (pullDistance >= pullDownThreshold) {
      setIsRefreshing(true);
      await onRefresh();
    }

    startYRef.current = null;
    setIsPulling(false);
  };

  // Calculate opacity based on pull distance
  const indicatorOpacity = Math.min(pullDistance / pullDownThreshold, 1);

  return (
    <div
      className="relative h-full overflow-y-auto overflow-x-hidden overscroll-none"
      style={{ WebkitOverflowScrolling: 'touch' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={containerRef}
    >
      {/* Pull-to-refresh indicator */}
      <div
        className={`absolute left-0 right-0 top-0 z-10 flex items-center justify-center transition-height duration-200`}
        style={{
          height: `${pullDistance}px`,
          opacity: indicatorOpacity,
          transitionProperty: 'height',
        }}
      >
        <span className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
      </div>

      {children}
    </div>
  );
};

export default memo(PullToRefresh);
