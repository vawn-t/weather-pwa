import React from 'react';
import Skeleton from './index';

interface SkeletonCardProps {
  className?: string;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '' }) => {
  return (
    <div
      className={`p-4 rounded-lg bg-white/10 backdrop-blur-sm mb-4 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <Skeleton height="1.5rem" width="40%" className="mb-2" />
        <Skeleton height="2.5rem" width="2.5rem" borderRadius="50%" />
      </div>
      <div className="flex items-center mb-2">
        <Skeleton width="5rem" height="3rem" className="mr-3" />
        <div className="flex-1">
          <Skeleton height="1.25rem" className="mb-2" />
          <Skeleton height="1rem" width="60%" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
