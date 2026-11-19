export type UserRole = 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  designation: string;
  managedTeam?: string[];
}

export interface LeaveRecord {
  id: string;
  empId: string;
  name: string;
  department: string;
  leaveType: 'Annual Leave' | 'Sick Leave' | 'Casual Leave';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedOn: string;
  processedBy?: string;
  processedAt?: string;
  rejectionReason?: string;
  version: number;
}

export interface HybridRequest {
  id: string;
  empId: string;
  name: string;
  department: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Revoked';
  appliedOn: string;
  approvedBy?: string;
  processedBy?: string;
  processedAt?: string;
  validUntil?: string;
  rejectionReason?: string;
  version: number;
}

export interface RegularizationRequest {
  id: string;
  empId: string;
  name: string;
  department: string;
  date: string;
  originalPunch: string;
  requestedPunch: string;
  type: 'Missed Check-In' | 'Missed Check-Out' | 'GPS Timeout / Device Glitch' | 'On-Duty Client Visit';
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedOn: string;
  processedBy?: string;
  processedAt?: string;
  rejectionReason?: string;
  version: number;
}

export interface AttendanceLog {
  id: string;
  empId: string;
  name: string;
  department: string;
  branch: string;
  date: string;
  checkIn: string;
  checkOut: string;
  workHours: string;
  locationStatus: 'Inside Geofence' | 'Hybrid Approved' | 'Geofence Breach' | 'Approved Leave';
  status: 'Present' | 'Late' | 'Absent' | 'On Leave';
  distanceMeters: number;
}

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
  leaveBalances?: {
    annual: { total: number; used: number };
    sick: { total: number; used: number };
    casual: { total: number; used: number };
  };
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  latitude: number;
  longitude: number;
  geofenceRadiusMeters: number;
  employeeCount: number;
  status: 'Active' | 'Inactive';
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  graceTimeMinutes: number;
  assignedStaff: number;
  type: 'Regular' | 'Flexible' | 'Overnight';
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  dayOfWeek: string;
  type: 'Mandatory' | 'Optional Floater';
  branchApplicability: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

export interface RolePermission {
  module: string;
  admin: boolean;
  hr: boolean;
  manager: boolean;
  employee: boolean;
}

export interface SystemSettings {
  geofenceRadiusMeters: number;
  lateGraceMinutes: number;
  permissions: RolePermission[];
}

export interface DatabaseSchema {
  leaves: LeaveRecord[];
  hybridRequests: HybridRequest[];
  regularizationRequests: RegularizationRequest[];
  attendanceLogs: AttendanceLog[];
  employees: Employee[];
  branches: Branch[];
  shifts: Shift[];
  holidays: Holiday[];
  auditLogs: AuditEntry[];
  settings: SystemSettings;
}
