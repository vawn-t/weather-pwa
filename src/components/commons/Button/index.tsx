import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  disabled?: boolean;
}

const Button = ({
  disabled = false,
  variant = 'primary',
  className,
  ...rest
}: ButtonProps) => {
  const baseStyles = 'px-4 py-2 font-semibold rounded';
  const variantStyles = {
    primary: 'text-white rounded-3xl',
    secondary: 'text-[#ECECEC]',
    icon: '',
  };

  const styles = `${baseStyles} ${variantStyles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  return <button className={styles} disabled={disabled} {...rest} />;
};

export default Button;
