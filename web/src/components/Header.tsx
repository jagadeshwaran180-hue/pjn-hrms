import React, { useState } from 'react';
import { Menu, Bell, ChevronDown, User, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar, title = 'Dashboard' }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('pjn_demo_auth');
    navigate('/login');
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

      {/* Right: Notification bell & Profile dropdown */}
      <div className="flex items-center gap-3 sm:gap-4">
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
              AD
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:inline-block">Admin</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {/* Profile Dropdown */}
          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 text-sm animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-semibold text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500 truncate">admin@pjntech.com</p>
                  <span className="inline-flex mt-1.5 items-center px-2 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-[#6338DF] border border-purple-100">
                    HR & System Admin
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
                  <button
                    onClick={() => { setShowDropdown(false); navigate('/settings'); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 text-left"
                  >
                    <Shield size={15} className="text-gray-400" />
                    <span>Security & Roles</span>
                  </button>
                </div>
                <div className="pt-1 border-t border-gray-100">
                  <button
                    onClick={() => { setShowDropdown(false); handleLogout(); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-left"
                  >
                    <LogOut size={15} />
                    <span>Logout</span>
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
