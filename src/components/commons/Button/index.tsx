import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
}

const Button = ({ disabled = false, className, ...rest }: ButtonProps) => {
  const baseStyles = 'font-semibold rounded cursor-pointer';

  const styles = `${baseStyles}  ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  return <button className={styles} disabled={disabled} {...rest} />;
};

export default Button;
