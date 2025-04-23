import React from 'react';
import Skeleton from './index';

interface SkeletonWeatherProps {
  className?: string;
}

const SkeletonWeather: React.FC<SkeletonWeatherProps> = ({
  className = '',
}) => {
  return (
    <div className={`w-full flex flex-col items-center ${className}`}>
      {/* Location and date section */}
      <div className="w-full flex flex-col items-center mb-6">
        <Skeleton width="40%" height="1.75rem" className="mb-2" />
        <Skeleton width="60%" height="1rem" />
      </div>

      {/* Temperature and weather icon */}
      <div className="flex items-center justify-center mb-8">
        <Skeleton
          width="7rem"
          height="7rem"
          borderRadius="50%"
          className="mr-6"
        />
        <Skeleton width="8rem" height="4rem" />
      </div>

      {/* Weather details */}
      <div className="w-full grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <Skeleton
            width="2.5rem"
            height="2.5rem"
            borderRadius="50%"
            className="mr-3"
          />
          <div>
            <Skeleton width="5rem" height="1.25rem" className="mb-2" />
            <Skeleton width="3rem" height="1rem" />
          </div>
        </div>
        <div className="flex items-center">
          <Skeleton
            width="2.5rem"
            height="2.5rem"
            borderRadius="50%"
            className="mr-3"
          />
          <div>
            <Skeleton width="5rem" height="1.25rem" className="mb-2" />
            <Skeleton width="3rem" height="1rem" />
          </div>
        </div>
      </div>

      {/* Forecast section */}
      <div className="w-full mt-8">
        <Skeleton width="30%" height="1.5rem" className="mb-4" />
        <div className="flex justify-between">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <Skeleton width="3rem" height="0.75rem" className="mb-2" />
              <Skeleton
                width="2.5rem"
                height="2.5rem"
                borderRadius="50%"
                className="mb-2"
              />
              <Skeleton width="2rem" height="1rem" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonWeather;
