import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'btn-primary',
    danger: 'btn-danger',
    outline: 'btn-outline',
    ghost: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-hover font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2',
  };

  const sizes = {
    sm: 'text-xs py-1.5 px-3',
    md: 'text-sm py-2.5 px-5',
    lg: 'text-base py-3 px-6',
  };

  return (
    <button
      className={`${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
