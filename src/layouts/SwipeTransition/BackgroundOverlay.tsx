import React from 'react';

interface BackgroundOverlayProps {
  progress: number;
  active: boolean;
}

/**
 * Background overlay that appears during swipe gesture
 * Creates a subtle depth effect for the transition
 */
const BackgroundOverlay: React.FC<BackgroundOverlayProps> = ({
  progress,
  active,
}) => {
  if (!active) return null;

  // Calculate opacity based on swipe progress
  const opacity = Math.min(progress * 0.5, 0.3);

  return (
    <div
      className="fixed inset-0 z-40 pointer-events-none"
      style={{
        opacity,
        background:
          'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
        transition: 'opacity 0.15s ease-out',
      }}
    />
  );
};

export default BackgroundOverlay;
