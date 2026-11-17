import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { PullToRefresh } from '../components/PullToRefresh';

export const AppShell: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Derive dynamic page title from route path
  const getPageTitle = (path: string) => {
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/company')) return 'Company & Branch Management';
    if (path.includes('/employees')) return 'Employee Management';
    if (path.includes('/attendance')) return 'GPS Attendance Dashboard';
    if (path.includes('/hybrid-approvals')) return 'Hybrid Work Approvals';
    if (path.includes('/leaves')) return 'Leave Management';
    if (path.includes('/shifts')) return 'Shift Management & Rostering';
    if (path.includes('/holiday-calendar')) return 'Company Holiday Calendar';
    if (path.includes('/regularization')) return 'Attendance Regularization';
    if (path.includes('/reports')) return 'Reports & Analytics';
    if (path.includes('/settings')) return 'Settings & Roles';
    if (path.includes('/audit-logs')) return 'Security Audit Logs';
    if (path.includes('/profile')) return 'My Employee Profile';
    return 'PJN Tech HRMS';
  };

  return (
    <div className="min-h-screen bg-[#F6F5FC] flex relative">
      {/* Fixed Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 relative">
        <Header
          onOpenMobileSidebar={() => setMobileOpen(true)}
          title={getPageTitle(location.pathname)}
        />

        {/* Faint PJN logo watermark behind content (2.5% opacity, non-interactive) */}
        <div
          className="pointer-events-none fixed inset-0 flex items-center justify-center lg:pl-64 z-0 overflow-hidden select-none"
          aria-hidden="true"
        >
          <svg
            className="w-[480px] h-[480px] text-[#6534E8] opacity-[0.025]"
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            <path d="M25 15H55C71.5685 15 85 28.4315 85 45C85 61.5685 71.5685 75 55 75H42V90H25V15ZM42 32V58H55C62.1797 58 68 52.1797 68 45C68 37.8203 62.1797 32 55 32H42Z" />
          </svg>
        </div>

        <PullToRefresh>
          <main
            key={location.pathname}
            className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto relative z-10 animate-page-fade"
          >
            <Outlet />
          </main>
        </PullToRefresh>
      </div>
    </div>
  );
};
