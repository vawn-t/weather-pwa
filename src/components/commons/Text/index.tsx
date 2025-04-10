import { HTMLAttributes } from 'react';

interface TextProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  as?: React.ElementType;
}

const Text: React.FC<TextProps> = ({
  children,
  variant = 'primary',
  className = '',
  as: Component = 'p',
}) => {
  const variantClasses = {
    primary: 'text-white font-medium',
    secondary: 'text-[#ECECEC] font-normal',
  };

  const combinedClasses = `${variantClasses[variant]} ${className}`;

  return <Component className={combinedClasses}>{children}</Component>;
};

export default Text;
