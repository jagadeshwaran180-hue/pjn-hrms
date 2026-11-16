import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './layouts/AppShell';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { CompanyManagement } from './pages/CompanyManagement';
import { EmployeeList } from './pages/EmployeeList';
import { AttendanceManagement } from './pages/AttendanceManagement';
import { HybridApprovals } from './pages/HybridApprovals';
import { LeaveManagement } from './pages/LeaveManagement';
import { ShiftManagement } from './pages/ShiftManagement';
import { HolidayCalendar } from './pages/HolidayCalendar';
import { AttendanceRegularization } from './pages/AttendanceRegularization';
import { ReportsAnalytics } from './pages/ReportsAnalytics';
import { SettingsRoles } from './pages/SettingsRoles';
import { AuditLogs } from './pages/AuditLogs';
import { UserProfile } from './pages/UserProfile';
import { ComingSoon } from './pages/ComingSoon';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication */}
        <Route path="/login" element={<Login />} />

        {/* Complete HRMS Platform Shell */}
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="company" element={<CompanyManagement />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="attendance" element={<AttendanceManagement />} />
          <Route path="hybrid-approvals" element={<HybridApprovals />} />
          <Route path="leaves" element={<LeaveManagement />} />
          <Route path="shifts" element={<ShiftManagement />} />
          <Route path="holiday-calendar" element={<HolidayCalendar />} />
          <Route path="regularization" element={<AttendanceRegularization />} />
          <Route path="reports" element={<ReportsAnalytics />} />
          <Route path="settings" element={<SettingsRoles />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="coming-soon/:module" element={<ComingSoon />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
