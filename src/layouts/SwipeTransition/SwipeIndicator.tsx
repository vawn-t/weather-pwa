import { SwipeIndicatorIcon } from '@components';
import React from 'react';

interface SwipeIndicatorProps {
  active: boolean;
}

/**
 * Visual indicator component that shows a back arrow during swipe
 */
const SwipeIndicator: React.FC<SwipeIndicatorProps> = ({ active }) => {
  if (!active) return null;

  const opacity = Math.min(progress * 2, 1);
  const translateX = Math.min(progress * 30, 20);
  const scale = 0.8 + progress * 0.4;

  return (
    <div
      className="fixed left-3 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-150"
      style={{
        opacity,
        transform: `translateX(${translateX}px) scale(${scale})`,
        filter: `drop-shadow(0 0 3px rgba(255, 255, 255, ${opacity * 0.3}))`,
      }}
    >
      <div className="bg-white/20 rounded-full p-2 backdrop-blur-sm">
        <SwipeIndicatorIcon />
      </div>
    </div>
  );
};

export default SwipeIndicator;
