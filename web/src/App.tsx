import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RefreshProvider } from './context/RefreshContext';
import { PrivateRoute } from './guards/PrivateRoute';
import { RoleGuard } from './guards/RoleGuard';
import { AppShell } from './layouts/AppShell';

// Auth & Error Pages
import { Login } from './pages/Login';
import { Forbidden } from './pages/Forbidden';

// Core Pages
import { Dashboard } from './pages/Dashboard';
import { UserProfile } from './pages/UserProfile';
import { AttendanceManagement } from './pages/AttendanceManagement';
import { LeaveManagement } from './pages/LeaveManagement';
import { AttendanceRegularization } from './pages/AttendanceRegularization';
import { HolidayCalendar } from './pages/HolidayCalendar';
import { HybridApprovals } from './pages/HybridApprovals';

// Management & Admin Pages
import { CompanyManagement } from './pages/CompanyManagement';
import { EmployeeList } from './pages/EmployeeList';
import { ShiftManagement } from './pages/ShiftManagement';
import { ReportsAnalytics } from './pages/ReportsAnalytics';
import { SettingsRoles } from './pages/SettingsRoles';
import { AuditLogs } from './pages/AuditLogs';
import { ComingSoon } from './pages/ComingSoon';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RefreshProvider>
          <Routes>
            {/* Public Authentication & Error Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/403" element={<Forbidden />} />

            {/* Protected Application Boundary - Deny by default without valid session */}
            <Route element={<PrivateRoute />}>
              <Route element={<AppShell />}>
                <Route index element={<Navigate to="/dashboard" replace />} />

                {/* 1. All-Roles Accessible Modules (Role-customized view within page) */}
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="attendance" element={<AttendanceManagement />} />
                <Route path="leaves" element={<LeaveManagement />} />
                <Route path="regularization" element={<AttendanceRegularization />} />
                <Route path="holiday-calendar" element={<HolidayCalendar />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="coming-soon/:module" element={<ComingSoon />} />

                {/* 2. Admin & HR Protected Routes */}
                <Route element={<RoleGuard allowedRoles={['ADMIN', 'HR']} />}>
                  <Route path="employees" element={<EmployeeList />} />
                  <Route path="hybrid-approvals" element={<HybridApprovals />} />
                </Route>

                {/* 3. Admin, HR & Manager Protected Routes */}
                <Route element={<RoleGuard allowedRoles={['ADMIN', 'HR', 'MANAGER']} />}>
                  <Route path="shifts" element={<ShiftManagement />} />
                  <Route path="reports" element={<ReportsAnalytics />} />
                </Route>

                {/* 4. Super Admin Only Protected Routes */}
                <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
                  <Route path="company" element={<CompanyManagement />} />
                  <Route path="audit-logs" element={<AuditLogs />} />
                  <Route path="settings" element={<SettingsRoles />} />
                </Route>
              </Route>
            </Route>

            {/* Global Fallback Route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </RefreshProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
