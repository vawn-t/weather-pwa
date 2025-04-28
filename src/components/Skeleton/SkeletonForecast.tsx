import Skeleton from './index';

const SkeletonForecast = () => (
  <div className="flex flex-col items-center text-center px-2 gap-5 min-w-20">
    <Skeleton className="h-4" />

    <div className="flex flex-col items-center gap-4 w-full">
      <Skeleton className="w-11 h-11 rounded-full" />

      <Skeleton />

      <Skeleton className="h-3"></Skeleton>
    </div>
  </div>
);

export default SkeletonForecast;
