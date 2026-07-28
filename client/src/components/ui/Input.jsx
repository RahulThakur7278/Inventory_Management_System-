import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  className = '',
  type = 'text',
  ...props
}, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Icon className="w-4 h-4 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`input-field ${Icon ? 'pl-10' : ''} ${error ? 'input-error' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 mt-1 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
