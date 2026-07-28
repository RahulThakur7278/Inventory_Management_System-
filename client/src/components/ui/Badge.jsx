const Badge = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400',
  };

  return (
    <span className={`badge ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
