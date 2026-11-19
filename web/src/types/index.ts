export interface Employee {
  id: string;
  name: string;
  department: string;
  designation: string;
  email: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  avatar?: string;
  joinDate?: string;
  role?: UserRole;
  managerId?: string;
  phone?: string;
  location?: string;
  branch?: string;
}

export interface LeaveRequest {
  id: string;
  empId?: string;
  employeeName: string;
  avatar?: string;
  leaveType: 'Annual Leave' | 'Sick Leave' | 'Casual Leave';
  status: 'Pending' | 'Approved' | 'Rejected';
  startDate?: string;
  endDate?: string;
  days?: number;
  reason?: string;
  appliedOn?: string;
}

export interface AttendanceDataPoint {
  day: string;
  presentCount: number;
  totalCount: number;
}

export interface KpiMetric {
  title: string;
  value: number | string;
  change?: string;
  icon: string;
  color: string;
  bgLight: string;
}

// --- RBAC & Auth Types ---

export type UserRole = 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE';

export type PermissionAction =
  | 'view_all_employees'
  | 'manage_employees'
  | 'view_all_attendance'
  | 'approve_team_requests'
  | 'approve_all_requests'
  | 'manage_shifts'
  | 'manage_holidays'
  | 'view_reports'
  | 'manage_roles_settings'
  | 'view_audit_logs'
  | 'view_own_records';

export interface UserSession {
  id: string; // e.g. 'EMP-001'
  email: string;
  name: string;
  role: UserRole;
  department: string;
  designation: string;
  managedTeam?: string[]; // IDs of employees reporting to this manager
}
