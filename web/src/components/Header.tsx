import React, { useState } from 'react';
import { Menu, Bell, ChevronDown, User, Shield, LogOut, RotateCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRefresh } from '../context/RefreshContext';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar, title = 'Dashboard' }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isRefreshing, refresh, lastRefreshed } = useRefresh();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Format last refreshed timestamp
  const formattedTime = lastRefreshed
    ? lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null;

  // Derive initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return 'HR & System Admin';
      case 'HR':
        return 'Human Resources Admin';
      case 'MANAGER':
        return 'Engineering Project Manager';
      default:
        return 'Employee (Self-Service)';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile trigger & Page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 -ml-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h1>
        </div>
      </div>

      {/* Right: Refresh button, Notification bell & Profile dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Desktop Refresh Button */}
        <button
          type="button"
          onClick={() => refresh()}
          disabled={isRefreshing}
          title={`Refresh current page data (Shift+R, or pull down on touch)\nLast updated: ${formattedTime || 'Just now'}`}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-700 hover:text-[#6338DF] hover:bg-purple-50/60 border border-gray-200/80 hover:border-purple-200 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="Refresh data"
        >
          <RotateCw
            size={14}
            className={`transition-transform duration-500 text-gray-500 hover:text-[#6338DF] ${
              isRefreshing ? 'animate-spin text-[#6338DF]' : ''
            }`}
          />
          <span className="hidden sm:inline">Refresh</span>
          <span className="hidden lg:inline text-[10px] text-gray-400 font-normal">
            (Shift+R)
          </span>
        </button>

        {/* Role badge pill */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 border border-gray-200 text-gray-700">
          <span className={`w-2 h-2 rounded-full ${
            user?.role === 'ADMIN' ? 'bg-[#6338DF]' :
            user?.role === 'HR' ? 'bg-blue-600' :
            user?.role === 'MANAGER' ? 'bg-amber-500' : 'bg-emerald-500'
          }`} />
          <span>Role: {user?.role || 'Guest'}</span>
        </div>

        {/* Notifications button */}
        <button
          type="button"
          className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          title="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444]" />
        </button>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-gray-200" />

        {/* Profile menu */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#6338DF] text-white flex items-center justify-center font-semibold text-xs shadow-sm">
              {getInitials(user?.name)}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-sm font-semibold text-gray-800 block leading-tight truncate max-w-[120px]">
                {user?.name || 'User'}
              </span>
              <span className="text-[10px] text-gray-500 block leading-tight font-mono">
                {user?.id || ''}
              </span>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {/* Profile Dropdown */}
          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 text-sm animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-semibold text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                  <span className={`inline-flex mt-1.5 items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${
                    user?.role === 'ADMIN' ? 'bg-purple-50 text-[#6338DF] border-purple-200' :
                    user?.role === 'HR' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    user?.role === 'MANAGER' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {getRoleLabel(user?.role)}
                  </span>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { setShowDropdown(false); navigate('/profile'); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 text-left"
                  >
                    <User size={15} className="text-gray-400" />
                    <span>My Profile</span>
                  </button>
                  
                  {/* Security & Roles link strictly visible to ADMIN only */}
                  {user?.role === 'ADMIN' && (
                    <button
                      onClick={() => { setShowDropdown(false); navigate('/settings'); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 text-left"
                    >
                      <Shield size={15} className="text-[#6338DF]" />
                      <span>Security & Roles (Admin)</span>
                    </button>
                  )}
                </div>
                <div className="pt-1 border-t border-gray-100">
                  <button
                    onClick={() => { setShowDropdown(false); handleLogout(); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-left"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
