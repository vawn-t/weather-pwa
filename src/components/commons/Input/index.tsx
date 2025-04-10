import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const InputField = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      placeholder,
      value,
      onChange,
      type = 'text',
      className = '',
      ...rest
    }: InputProps,
    ref
  ) => {
    const styles = `px-3 py-2 border rounded w-full ${className}`;

    return (
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={styles}
        {...rest}
      />
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;
