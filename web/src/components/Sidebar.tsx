import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import { navigationConfig } from '../config/navigation';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Filter navigation items strictly based on the authenticated user's role
  const userRole = user?.role || 'EMPLOYEE';
  const authorizedNavItems = navigationConfig.filter((item) =>
    item.roles.includes(userRole)
  );

  // Helper for role badge styling
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return { label: 'Admin', color: 'bg-purple-900/60 text-purple-300 border-purple-700/50' };
      case 'HR':
        return { label: 'HR Admin', color: 'bg-blue-900/60 text-blue-300 border-blue-700/50' };
      case 'MANAGER':
        return { label: 'Manager', color: 'bg-amber-900/60 text-amber-300 border-amber-700/50' };
      default:
        return { label: 'Employee', color: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50' };
    }
  };

  const badgeInfo = getRoleBadge(userRole);

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#161A3D] text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#6338DF] flex items-center justify-center font-bold text-lg shadow-sm">
              P
            </div>
            <div>
              <div className="font-bold text-sm tracking-wide">PJN Tech</div>
              <div className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">HRMS Platform</div>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md text-gray-400 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation list - strictly role filtered */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {authorizedNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#6338DF] text-white shadow-sm'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon size={18} className="shrink-0" />
                  <span className="truncate">{item.name}</span>
                </div>
                {item.badge && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded font-semibold bg-white/10 text-purple-200">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* User profile & quick logout footer */}
        <div className="p-3 border-t border-white/10 bg-black/10">
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-semibold text-white shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-white truncate">
                    {user?.name || 'Authorized User'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${badgeInfo.color}`}>
                    {badgeInfo.label}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono truncate">
                    {user?.id || ''}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out of HRMS"
              className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-white/10 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
