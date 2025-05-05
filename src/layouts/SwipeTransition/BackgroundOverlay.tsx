import React from 'react';

interface BackgroundOverlayProps {
  active: boolean;
}

/**
 * Background overlay that appears during swipe gesture
 * Creates a subtle depth effect for the transition
 */
const BackgroundOverlay: React.FC<BackgroundOverlayProps> = ({ active }) => {
  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-40 pointer-events-none"
      style={{
        background:
          'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
        transition: 'opacity 0.15s ease-out',
      }}
    />
  );
};

export default BackgroundOverlay;
