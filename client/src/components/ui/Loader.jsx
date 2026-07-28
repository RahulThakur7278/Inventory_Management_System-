import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = false, size = 'md', text = '' }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className={`${sizes.lg} text-primary-600 animate-spin`} />
          {text && (
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{text}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className={`${sizes[size]} text-primary-600 animate-spin`} />
        {text && (
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{text}</p>
        )}
      </div>
    </div>
  );
};

export default Loader;
