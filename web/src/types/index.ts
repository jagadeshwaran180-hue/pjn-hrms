export interface Employee {
  id: string;
  name: string;
  department: string;
  designation: string;
  email: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  avatar?: string;
  joinDate?: string;
}

export interface LeaveRequest {
  id: string;
  employeeName: string;
  avatar?: string;
  leaveType: 'Annual Leave' | 'Sick Leave' | 'Casual Leave';
  status: 'Pending' | 'Approved' | 'Rejected';
  startDate?: string;
  endDate?: string;
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
