import { PackageOpen } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No data found',
  description = 'There are no items to display.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-dark-hover flex items-center justify-center mb-5">
        <Icon className="w-10 h-10 text-gray-300 dark:text-gray-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm mb-5">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
