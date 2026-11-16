import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './layouts/AppShell';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { CompanyManagement } from './pages/CompanyManagement';
import { EmployeeList } from './pages/EmployeeList';
import { AttendanceManagement } from './pages/AttendanceManagement';
import { HybridApprovals } from './pages/HybridApprovals';
import { ReportsAnalytics } from './pages/ReportsAnalytics';
import { ShiftManagement } from './pages/ShiftManagement';
import { SettingsRoles } from './pages/SettingsRoles';
import { AuditLogs } from './pages/AuditLogs';
import { ComingSoon } from './pages/ComingSoon';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication Screen */}
        <Route path="/login" element={<Login />} />

        {/* Protected App Shell for Jagadeesh 7-Day Plan */}
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="company" element={<CompanyManagement />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="attendance" element={<AttendanceManagement />} />
          <Route path="hybrid-approvals" element={<HybridApprovals />} />
          <Route path="reports" element={<ReportsAnalytics />} />
          <Route path="shifts" element={<ShiftManagement />} />
          <Route path="settings" element={<SettingsRoles />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="coming-soon/:module" element={<ComingSoon />} />
        </Route>

        {/* Wildcard Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
