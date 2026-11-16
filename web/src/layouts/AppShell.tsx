import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

export const AppShell: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Derive dynamic page title from route path
  const getPageTitle = (path: string) => {
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/employees')) return 'Employee Management';
    if (path.includes('/coming-soon/attendance')) return 'Attendance Management';
    if (path.includes('/coming-soon/leaves')) return 'Leave Management';
    if (path.includes('/coming-soon/shifts')) return 'Shift Management';
    if (path.includes('/coming-soon/holiday-calendar')) return 'Holiday Calendar';
    if (path.includes('/coming-soon/regularization')) return 'Regularization';
    if (path.includes('/coming-soon/reports')) return 'Reports & Analytics';
    if (path.includes('/coming-soon/settings')) return 'Settings & Roles';
    if (path.includes('/coming-soon/audit-logs')) return 'Audit Logs';
    return 'HRMS';
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
