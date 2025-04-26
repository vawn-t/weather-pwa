import classNames from 'classnames';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  borderRadius?: string;
  animation?: 'pulse' | 'shimmer' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius = '4px',
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
        'bg-gray-300/30 dark:bg-gray-700/30',
        animationClasses,
        className
      )}
      style={{
        width,
        height,
        borderRadius,
      }}
    ></div>
  );
};

export default Skeleton;
