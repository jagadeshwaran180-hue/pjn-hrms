import React, { useState } from 'react';
import { Menu, Bell, ChevronDown, User, Shield, LogOut, RotateCw, CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRefresh } from '../context/RefreshContext';
import { useKolkataDate } from '../hooks/useKolkataDate';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar, title = 'Dashboard' }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isRefreshing, refresh, lastRefreshed } = useRefresh();
  const kolkataDate = useKolkataDate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Last-refreshed label shown in Refresh button tooltip
  const formattedTime = lastRefreshed
    ? lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null;

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'ADMIN':   return 'HR & System Admin';
      case 'HR':      return 'Human Resources Admin';
      case 'MANAGER': return 'Engineering Project Manager';
      default:        return 'Employee (Self-Service)';
    }
  };

  const roleDotColor =
    user?.role === 'ADMIN'   ? 'bg-[#6534E8]' :
    user?.role === 'HR'      ? 'bg-blue-600'  :
    user?.role === 'MANAGER' ? 'bg-amber-500'  : 'bg-emerald-500';

  const roleBadgeColor =
    user?.role === 'ADMIN'   ? 'bg-purple-50 text-[#6534E8] border-purple-200' :
    user?.role === 'HR'      ? 'bg-blue-50 text-blue-700 border-blue-200'      :
    user?.role === 'MANAGER' ? 'bg-amber-50 text-amber-700 border-amber-200'   :
                               'bg-emerald-50 text-emerald-700 border-emerald-200';

  return (
    <header className="bg-white border-b border-[#E5E2F0] sticky top-0 z-30 shadow-xs">
      {/* ── Primary row ──────────────────────────────────────────── */}
      <div className="h-14 sm:h-16 px-3 sm:px-6 flex items-center gap-3 sm:gap-4">
        {/* LEFT: hamburger + page title */}
        <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
          <button
            onClick={onOpenMobileSidebar}
            className="p-1.5 -ml-1 rounded-lg text-slate-600 hover:text-[#111827] hover:bg-slate-100 lg:hidden transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-base sm:text-xl font-bold text-[#111827] tracking-tight truncate max-w-[130px] xs:max-w-[180px] sm:max-w-xs md:max-w-sm lg:max-w-none">
            {title}
          </h1>
        </div>

        {/* CENTER: today's date — in-flow, never absolute */}
        <div
          className="hidden sm:flex flex-1 items-center justify-center gap-2 select-none pointer-events-none min-w-0"
          aria-label={`Today's date: ${kolkataDate.full}`}
          title={`Today's date (IST): ${kolkataDate.full}`}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F0FD] border border-purple-100/80">
            <CalendarDays size={14} className="text-[#6534E8] flex-shrink-0" />
            <span className="hidden lg:block text-xs sm:text-sm font-semibold text-[#151936] whitespace-nowrap tracking-tight">
              {kolkataDate.full}
            </span>
            <span className="block lg:hidden text-xs font-semibold text-[#151936] whitespace-nowrap">
              {kolkataDate.compact}
            </span>
          </div>
        </div>

        {/* RIGHT: Refresh · Role badge · Bell · Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-auto sm:ml-0">
          {/* Refresh button */}
          <button
            type="button"
            onClick={() => refresh()}
            disabled={isRefreshing}
            title={`Refresh page data (Shift+R, or pull down on touch)\nLast updated: ${formattedTime || 'Just now'}`}
            aria-label="Refresh data"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#111827] hover:text-[#6534E8] hover:bg-[#F4F0FD] border border-[#E5E2F0] hover:border-purple-200 transition-all active:scale-[0.98] motion-reduce:transform-none disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <RotateCw
              size={14}
              className={`transition-transform duration-500 ${
                isRefreshing ? 'animate-spin text-[#6534E8]' : 'text-slate-500'
              }`}
            />
            <span className="hidden sm:inline">Refresh</span>
            <span className="hidden lg:inline text-[10px] text-slate-400 font-normal">(Shift+R)</span>
          </button>

          {/* Role badge — only on xl+ to avoid crowding */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700">
            <span className={`w-2 h-2 rounded-full ${roleDotColor}`} />
            <span>Role: {user?.role || 'Guest'}</span>
          </div>

          {/* Notifications */}
          <button
            type="button"
            className="relative p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-[#111827] hover:bg-slate-100 transition-colors"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 h-2 rounded-full bg-[#EF4444]" />
          </button>

          {/* Vertical divider */}
          <div className="h-6 w-px bg-slate-200" />

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-1.5 p-1 sm:p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#6534E8] text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
                {getInitials(user?.name)}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-sm font-semibold text-[#111827] block leading-tight truncate max-w-[90px] lg:max-w-[120px]">
                  {user?.name || 'User'}
                </span>
                <span className="text-[10px] text-slate-500 block leading-tight font-mono">
                  {user?.id || ''}
                </span>
              </div>
              <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
            </button>

            {/* Dropdown menu */}
            {showDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E5E2F0] py-1.5 z-50 text-sm animate-modal-lift">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-semibold text-[#111827]">{user?.name || 'User'}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
                    <span className={`inline-flex mt-1.5 items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${roleBadgeColor}`}>
                      {getRoleLabel(user?.role)}
                    </span>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => { setShowDropdown(false); navigate('/profile'); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 text-left transition-colors"
                    >
                      <User size={15} className="text-slate-400" />
                      <span>My Profile</span>
                    </button>
                    {user?.role === 'ADMIN' && (
                      <button
                        onClick={() => { setShowDropdown(false); navigate('/settings'); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 text-left transition-colors"
                      >
                        <Shield size={15} className="text-[#6534E8]" />
                        <span>Security &amp; Roles (Admin)</span>
                      </button>
                    )}
                  </div>
                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => { setShowDropdown(false); handleLogout(); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-left transition-colors"
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
      </div>

      {/* ── Mobile date sub-row (hidden on sm+) ───────────────────── */}
      <div
        className="sm:hidden flex items-center gap-2 px-4 py-1.5 bg-[#F4F0FD] border-t border-purple-100 select-none pointer-events-none"
        aria-label={`Today's date: ${kolkataDate.full}`}
      >
        <CalendarDays size={13} className="text-[#6534E8] flex-shrink-0" />
        <span className="text-xs font-semibold text-[#151936]">{kolkataDate.compact}</span>
      </div>
    </header>
  );
};
