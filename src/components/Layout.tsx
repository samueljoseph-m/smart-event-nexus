
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, ROLES } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  Bell, 
  Calendar, 
  CheckSquare, 
  ChevronDown, 
  Menu, 
  Users, 
  LogOut, 
  Settings,
  User,
  Briefcase,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  roles: string[];
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, hasPermission } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    { 
      name: 'Dashboard', 
      href: '/dashboard',
      icon: <div className="w-5 h-5 flex items-center justify-center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg></div>,
      roles: [ROLES.ADMIN, ROLES.DEPARTMENT_HEAD, ROLES.SUPERVISOR, ROLES.VOLUNTEER, ROLES.SUBSCRIBER]
    },
    { 
      name: 'Events', 
      href: '/events',
      icon: <Calendar className="w-5 h-5" />, 
      roles: [ROLES.ADMIN, ROLES.DEPARTMENT_HEAD, ROLES.SUPERVISOR, ROLES.VOLUNTEER, ROLES.SUBSCRIBER]
    },
    { 
      name: 'Tasks', 
      href: '/tasks',
      icon: <CheckSquare className="w-5 h-5" />,
      roles: [ROLES.ADMIN, ROLES.DEPARTMENT_HEAD, ROLES.SUPERVISOR, ROLES.VOLUNTEER, ROLES.SUBSCRIBER]
    },
    { 
      name: 'Users', 
      href: '/users',
      icon: <Users className="w-5 h-5" />,
      roles: [ROLES.ADMIN, ROLES.DEPARTMENT_HEAD] 
    },
    { 
      name: 'Departments', 
      href: '/departments',
      icon: <Briefcase className="w-5 h-5" />,
      roles: [ROLES.ADMIN, ROLES.DEPARTMENT_HEAD] 
    },
    { 
      name: 'Subscriptions', 
      href: '/subscriptions',
      icon: <CreditCard className="w-5 h-5" />,
      roles: [ROLES.ADMIN, ROLES.DEPARTMENT_HEAD, ROLES.SUPERVISOR, ROLES.SUBSCRIBER] 
    },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
                onClick={toggleSidebar}
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link to="/" className="flex-shrink-0 flex items-center ml-4">
                <span className="text-xl font-bold text-purple-700">Smart Event Manager</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-purple-200 text-purple-800">
                        {user?.name?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    {user?.role} {user?.isPremium && "• Premium"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/subscriptions')}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Subscription</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-10 w-64 bg-white shadow transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 lg:h-auto",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="h-16 flex items-center justify-between px-4 lg:hidden">
            <span className="text-xl font-bold text-purple-700">Menu</span>
            <button
              className="p-2 rounded-md text-gray-700 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Close sidebar</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="mt-5 px-4 space-y-1">
            {navItems.map((item) => {
              // Only show if the user has the right role
              if (!hasPermission(item.roles)) {
                return null;
              }

              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "group flex items-center px-3 py-3 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-purple-100 text-purple-800"
                      : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info at bottom of sidebar */}
          <div className="absolute bottom-0 w-full border-t border-gray-200 p-4">
            <div className="flex items-center">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-purple-200 text-purple-800">
                  {user?.name?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs font-medium text-gray-500">
                  {user?.role}
                  {user?.isPremium && <span className="ml-2 badge-premium">Premium</span>}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
