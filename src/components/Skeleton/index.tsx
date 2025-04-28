import classNames from 'classnames';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: 'pulse' | 'shimmer' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  animation = 'pulse',
}) => {
  const animationClasses = {
    'animate-pulse': animation === 'pulse',
    'animate-shimmer': animation === 'shimmer',
  };

  return (
    <div
      className={classNames(
        'bg-gray-300/30 dark:bg-gray-700/30 w-full h-4 rounded-2xl',
        animationClasses,
        className
      )}
    />
  );
};

export default Skeleton;
