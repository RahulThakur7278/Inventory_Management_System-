const Card = ({ title, value, icon: Icon, color = 'primary', subtitle, className = '' }) => {
  const colors = {
    primary: {
      bg: 'bg-primary-50 dark:bg-primary-900/20',
      icon: 'text-primary-600 dark:text-primary-400',
      gradient: 'from-primary-500 to-primary-700',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      icon: 'text-emerald-600 dark:text-emerald-400',
      gradient: 'from-emerald-500 to-emerald-700',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      icon: 'text-amber-600 dark:text-amber-400',
      gradient: 'from-amber-500 to-amber-700',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      icon: 'text-red-600 dark:text-red-400',
      gradient: 'from-red-500 to-red-700',
    },
  };

  const colorConfig = colors[color] || colors.primary;

  return (
    <div className={`card p-6 animate-slide-up ${className}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
          )}
        </div>
        <div className={`w-14 h-14 rounded-2xl ${colorConfig.bg} flex items-center justify-center`}>
          {Icon && <Icon className={`w-7 h-7 ${colorConfig.icon}`} />}
        </div>
      </div>
    </div>
  );
};

export default Card;
