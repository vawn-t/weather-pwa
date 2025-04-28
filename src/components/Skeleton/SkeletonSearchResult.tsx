import React from 'react';
import Skeleton from './index';

interface SkeletonSearchResultProps {
  count?: number;
  className?: string;
}

const SkeletonSearchResult: React.FC<SkeletonSearchResultProps> = ({
  count = 3,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="flex items-center p-3 bg-white/10 backdrop-blur-sm rounded-lg"
          >
            <div className="flex-1">
              <Skeleton className="h-3 w-2/5" />
            </div>
          </div>
        ))}
    </div>
  );
};

export default SkeletonSearchResult;
