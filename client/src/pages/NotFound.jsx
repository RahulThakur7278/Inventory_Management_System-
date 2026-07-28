import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg p-6">
      <div className="text-center max-w-md animate-fade-in">
        {/* 404 number */}
        <div className="relative mb-8">
          <h1 className="text-[150px] font-black text-gray-100 dark:text-dark-card leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
              <span className="text-3xl">🔍</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" icon={ArrowLeft} onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button icon={Home} onClick={() => navigate('/')}>
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
