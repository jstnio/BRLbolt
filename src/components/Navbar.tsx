import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  Menu, X, Package, Database, List, FileText, 
  ChevronDown, LogOut, Settings, User
} from 'lucide-react';
import { Transition } from '@headlessui/react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const navigationItems = user?.role === 'manager' ? [
    { name: 'Shipments', path: '/manager', icon: Package },
    { name: 'Quotes', path: '/quotes', icon: FileText },
    { name: 'Data', path: '/master-data', icon: Database },
  ] : [
    { name: 'My Shipments', path: '/customer', icon: Package },
  ];

  const userMenuItems = [
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <nav className="bg-white shadow-hubspot">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="h-10 w-24 bg-[#193375] text-white font-black text-2xl flex items-center justify-center">
                BRL
              </div>
              <span className="ml-2 text-xl font-display font-semibold text-gray-900">Global</span>
            </Link>

            {user && (
              <div className="hidden md:ml-8 md:flex md:space-x-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                        isActive(item.path)
                          ? 'text-primary-700 bg-primary-50'
                          : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="ml-3 relative flex items-center">
                <div className="relative group">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 group"
                    id="user-menu"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-900 hidden md:block transition-colors">
                      {user.name}
                    </span>
                    <ChevronDown className="ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </button>

                  {showUserMenu && (
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-50"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu"
                    >
                      <div className="py-1" role="none">
                        <div className="px-4 py-2 text-sm text-gray-700" role="menuitem">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="py-1" role="none">
                        {userMenuItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.path}
                              onClick={() => {
                                setShowUserMenu(false);
                                navigate(item.path);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                              role="menuitem"
                            >
                              <Icon className="mr-2 h-4 w-4" />
                              {item.name}
                            </button>
                          );
                        })}
                      </div>
                      <div className="py-1" role="none">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center"
                          role="menuitem"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 font-medium hover:bg-primary-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden ml-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Transition
        show={isOpen}
        enter="transition ease-out duration-100 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="md:hidden border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block pl-3 pr-4 py-2 text-base font-medium ${
                    isActive(item.path)
                      ? 'text-primary-700 bg-primary-50 border-l-4 border-primary-500'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50 hover:border-l-4 hover:border-primary-300'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center">
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </Transition>
    </nav>
  );
}