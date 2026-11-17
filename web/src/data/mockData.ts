import { Employee, LeaveRequest, AttendanceDataPoint } from '../types';

export const mockKpis = [
  {
    id: 'employees',
    title: 'Employees',
    value: 154,
    subtitle: 'Total workforce',
    iconName: 'Users',
    accentColor: '#3B82F6',
    bgColor: '#EFF6FF'
  },
  {
    id: 'present',
    title: 'Present Today',
    value: 142,
    subtitle: '92.2% turnout',
    iconName: 'UserCheck',
    accentColor: '#10B981',
    bgColor: '#ECFDF5'
  },
  {
    id: 'on_leave',
    title: 'On Leave',
    value: 1, // Only Priya S has approved leave covering 17 Nov
    subtitle: 'Approved leave',
    iconName: 'UserX',
    accentColor: '#F59E0B',
    bgColor: '#FFFBEB'
  },
  {
    id: 'late',
    title: 'Late Arrivals',
    value: 4,
    subtitle: 'After 09:30 AM',
    iconName: 'Clock',
    accentColor: '#EF4444',
    bgColor: '#FEF2F2'
  }
];

export const mockAttendanceTrend: AttendanceDataPoint[] = [
  { day: 'Mon', presentCount: 138, totalCount: 154 },
  { day: 'Tue', presentCount: 144, totalCount: 154 },
  { day: 'Wed', presentCount: 140, totalCount: 154 },
  { day: 'Thu', presentCount: 146, totalCount: 154 },
  { day: 'Fri', presentCount: 142, totalCount: 154 }
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'LR-101',
    employeeName: 'Arun Kumar',
    leaveType: 'Annual Leave',
    status: 'Pending',
    startDate: '18 Nov 2026',
    endDate: '20 Nov 2026'
  },
  {
    id: 'LR-102',
    employeeName: 'Priya S',
    leaveType: 'Sick Leave',
    status: 'Approved',
    startDate: '16 Nov 2026',
    endDate: '17 Nov 2026'
  },
  {
    id: 'LR-103',
    employeeName: 'Rahul M',
    leaveType: 'Casual Leave',
    status: 'Pending',
    startDate: '21 Nov 2026',
    endDate: '21 Nov 2026'
  }
];

export const mockEmployees: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Jagadeesh K',
    department: 'Engineering',
    designation: 'Frontend Lead',
    email: 'jagadeesh@pjntech.com',
    status: 'Active',
    joinDate: '12 Jan 2023'
  },
  {
    id: 'EMP-002',
    name: 'Imran M',
    department: 'Engineering',
    designation: 'Project Lead',
    email: 'imran@pjntech.com',
    status: 'Active',
    joinDate: '01 Mar 2022'
  },
  {
    id: 'EMP-003',
    name: 'Karthick R',
    department: 'Mobile Apps',
    designation: 'React Native Dev',
    email: 'karthick@pjntech.com',
    status: 'Active',
    joinDate: '15 Jun 2023'
  },
  {
    id: 'EMP-004',
    name: 'Ayesha N',
    department: 'Backend',
    designation: 'Spring Boot Lead',
    email: 'ayesha@pjntech.com',
    status: 'Active',
    joinDate: '10 Aug 2022'
  },
  {
    id: 'EMP-005',
    name: 'Arun Kumar',
    department: 'Human Resources',
    designation: 'HR Executive',
    email: 'arun@pjntech.com',
    status: 'On Leave',
    joinDate: '05 Jan 2024'
  },
  {
    id: 'EMP-006',
    name: 'Priya S',
    department: 'Quality Assurance',
    designation: 'QA Engineer',
    email: 'priya@pjntech.com',
    status: 'On Leave',
    joinDate: '20 Sep 2023'
  },
  {
    id: 'EMP-007',
    name: 'Rahul M',
    department: 'DevOps & Cloud',
    designation: 'DevOps Engineer',
    email: 'rahul@pjntech.com',
    status: 'Active',
    joinDate: '03 Nov 2023'
  },
  {
    id: 'EMP-008',
    name: 'Trupthi V',
    department: 'Database',
    designation: 'Database Architect',
    email: 'trupthi@pjntech.com',
    status: 'Active',
    joinDate: '18 Jul 2022'
  },
  {
    id: 'EMP-009',
    name: 'Anuvrath P',
    department: 'Backend',
    designation: 'API Specialist',
    email: 'anuvrath@pjntech.com',
    status: 'Active',
    joinDate: '02 Feb 2024'
  },
  {
    id: 'EMP-010',
    name: 'Amrutha K',
    department: 'Quality Assurance',
    designation: 'Web & API QA',
    email: 'amrutha@pjntech.com',
    status: 'Active',
    joinDate: '14 May 2024'
  }
];
