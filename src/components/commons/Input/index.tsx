import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const InputField = ({
  placeholder,
  value,
  onChange,
  type = 'text',
  className = '',
}: InputProps) => {
  const styles = `px-3 py-2 border rounded w-full ${className}`;

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={styles}
    />
  );
};

export default InputField;
