import { Menu, Moon, Sun, LogOut, User } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Navbar = ({ toggleSidebar, darkMode, toggleDarkMode }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 h-[72px] bg-white/80 dark:bg-dark-card/80 backdrop-blur-lg border-b border-gray-200 dark:border-dark-border">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-hover transition-all duration-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* User info */}
          <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-dark-border">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-md">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-none">
                {user?.name || 'Admin'}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">{user?.role || 'admin'}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="p-2.5 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
