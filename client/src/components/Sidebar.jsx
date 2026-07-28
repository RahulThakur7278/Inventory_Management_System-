import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Tags,
  X,
  Box,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Categories', href: '/categories', icon: Tags },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-full w-64 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-[72px] px-6 border-b border-gray-200 dark:border-dark-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
            <Box className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-none">InvenTrack</h1>
            <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">Management</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <p className="px-4 mb-3 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Menu
        </p>
        {navigation.map((item) => {
          const isActive =
            item.href === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.href);

          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`} />
              <span>{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-border">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          © 2024 InvenTrack
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
