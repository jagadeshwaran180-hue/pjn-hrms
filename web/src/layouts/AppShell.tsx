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
    <div className="min-h-screen bg-[#F7F7FC] flex">
      {/* Fixed Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header
          onOpenMobileSidebar={() => setMobileOpen(true)}
          title={getPageTitle(location.pathname)}
        />
        <PullToRefresh>
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </PullToRefresh>
      </div>
    </div>
  );
};
