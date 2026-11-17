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

  // Helper for role badge styling — adapted for lavender background
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return { label: 'Administrator', color: 'bg-[#6534E8]/15 text-[#6534E8] border-[#6534E8]/30' };
      case 'HR':
        return { label: 'HR Admin', color: 'bg-blue-500/15 text-blue-700 border-blue-400/30' };
      case 'MANAGER':
        return { label: 'Manager', color: 'bg-amber-500/15 text-amber-700 border-amber-400/30' };
      default:
        return { label: 'Employee', color: 'bg-emerald-500/15 text-emerald-700 border-emerald-400/30' };
    }
  };

  const badgeInfo = getRoleBadge(userRole);

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      {/* ── Soft Lavender Sidebar ── */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: '#F3EFFF', borderRight: '1px solid #DDD6F7' }}
      >

        {/* ── Brand header ── */}
        <div
          className="flex items-center justify-between h-16 px-5 shrink-0"
          style={{ borderBottom: '1px solid #DDD6F7' }}
        >
          <div className="flex items-center gap-3">
            {/* P logo mark */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-base text-white shrink-0"
              style={{
                background: '#6534E8',
                boxShadow: '0 2px 8px 0 rgba(101,52,232,0.30)',
              }}
            >
              P
            </div>
            <div>
              <div
                className="font-bold text-sm tracking-wide leading-tight"
                style={{ color: '#151936' }}
              >
                PJN Tech
              </div>
              <div
                className="text-[10px] font-semibold tracking-widest uppercase"
                style={{ color: '#7C6FAF' }}
              >
                HRMS Platform
              </div>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg lg:hidden transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6534E8]"
            style={{ color: '#7C6FAF' }}
            aria-label="Close sidebar"
            onMouseEnter={(e) => (e.currentTarget.style.background = '#E8E0FF')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Navigation list (scrollable) ── */}
        <nav
          className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5"
          aria-label="Main navigation"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#C4B5F5 transparent' }}
        >
          {authorizedNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  [
                    'sidebar-nav-item group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-150 outline-none',
                    'focus-visible:ring-2 focus-visible:ring-[#6534E8] focus-visible:ring-offset-1 focus-visible:ring-offset-[#F3EFFF]',
                    isActive
                      ? 'nav-active font-semibold'
                      : 'font-medium nav-inactive',
                  ].join(' ')
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        size={20}
                        className="shrink-0 transition-colors duration-150"
                        style={{ color: isActive ? '#6534E8' : '#151936' }}
                        strokeWidth={isActive ? 2.2 : 1.8}
                      />
                      <span
                        className="leading-snug"
                        style={{
                          color: isActive ? '#6534E8' : '#151936',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '148px',
                        }}
                        title={item.name}
                      >
                        {item.name}
                      </span>
                    </div>
                    {item.badge && (
                      <span
                        className="ml-auto text-[10px] px-1.5 py-0.5 rounded font-semibold shrink-0"
                        style={{
                          background: isActive ? '#EDE8FF' : 'rgba(101,52,232,0.12)',
                          color: '#6534E8',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* ── User profile & sign-out footer ── */}
        <div
          className="p-3 shrink-0"
          style={{ borderTop: '1px solid #DDD6F7', background: '#EDE8FF' }}
        >
          <div
            className="flex items-center justify-between p-2 rounded-lg transition-colors duration-150"
            style={{ background: 'transparent' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#E0D8FF')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {/* Avatar */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{
                  background: '#6534E8',
                  boxShadow: '0 1px 4px 0 rgba(101,52,232,0.30)',
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>

              {/* Name + role */}
              <div className="min-w-0 flex-1">
                <p
                  className="text-xs font-semibold truncate leading-tight"
                  style={{ color: '#151936' }}
                >
                  {user?.name || 'Authorized User'}
                </p>
                <div className="mt-0.5">
                  <span
                    className={`text-[9px] font-semibold px-1.5 py-px rounded border ${badgeInfo.color}`}
                  >
                    {badgeInfo.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Sign-out button */}
            <button
              onClick={handleLogout}
              title="Sign out of HRMS"
              aria-label="Sign out of HRMS"
              className="p-1.5 rounded-lg transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6534E8]"
              style={{ color: '#7C6FAF' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#6534E8';
                e.currentTarget.style.background = '#D6CCFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#7C6FAF';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

    </>
  );
};
