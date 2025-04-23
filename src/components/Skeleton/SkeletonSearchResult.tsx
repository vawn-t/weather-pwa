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
            <div className="mr-3">
              <Skeleton height="1.5rem" width="1.5rem" borderRadius="50%" />
            </div>
            <div className="flex-1">
              <Skeleton height="1rem" className="mb-2" width="60%" />
              <Skeleton height="0.75rem" width="40%" />
            </div>
          </div>
        ))}
    </div>
  );
};

export default SkeletonSearchResult;
