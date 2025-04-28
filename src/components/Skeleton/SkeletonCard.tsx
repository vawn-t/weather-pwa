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
        <Skeleton className="h-6 w-2/5 mb-2" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <div className="flex items-center mb-2">
        <Skeleton className="w-20 h-12 mr-3" />
        <div className="flex-1">
          <Skeleton className="h-5 mb-2" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
