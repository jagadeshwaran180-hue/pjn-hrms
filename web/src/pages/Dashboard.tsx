import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  UserPlus,
  CalendarPlus,
  ClipboardCheck,
  FileSpreadsheet,
  ArrowUpRight,
  TrendingUp,
  Search,
  ExternalLink,
  Building,
  Laptop,
  FileCheck2,
  User
} from 'lucide-react';
import { mockKpis, mockAttendanceTrend, mockLeaveRequests, mockEmployees } from '../data/mockData';
import { Card, Badge, Button, Modal } from '../components/ui';
import { useAuth } from '../context/AuthContext';

type KpiType = 'employees' | 'present' | 'on_leave' | 'late' | null;

interface PresentEmployeeRecord {
  id: string;
  name: string;
  department: string;
  branch: string;
  checkIn: string;
  mode: 'In-House' | 'Hybrid Approved';
  geofence: string;
  distance: string;
  status: 'On-Time' | 'Late';
}

interface OnLeaveRecord {
  id: string;
  name: string;
  department: string;
  leaveType: string;
  duration: string;
  reason: string;
  approvedBy: string;
}

interface LateArrivalRecord {
  id: string;
  name: string;
  department: string;
  checkIn: string;
  delay: string;
  shift: string;
  reason: string;
  regularizationStatus: 'Pending Request' | 'Approved' | 'Action Needed';
}

// Mock dataset for Today's Present Employees
const mockPresentList: PresentEmployeeRecord[] = [
  { id: 'EMP-001', name: 'Jagadeesh K', department: 'Engineering', branch: 'BLR-HQ', checkIn: '09:02 AM', mode: 'In-House', geofence: 'Within Geofence', distance: '14m', status: 'On-Time' },
  { id: 'EMP-002', name: 'Imran M', department: 'Engineering', branch: 'BLR-HQ', checkIn: '09:10 AM', mode: 'In-House', geofence: 'Within Geofence', distance: '12m', status: 'On-Time' },
  { id: 'EMP-003', name: 'Karthick R', department: 'Mobile Apps', branch: 'MAA-01', checkIn: '09:20 AM', mode: 'In-House', geofence: 'Within Geofence', distance: '45m', status: 'On-Time' },
  { id: 'EMP-004', name: 'Ayesha N', department: 'Backend', branch: 'BLR-HQ', checkIn: '09:48 AM', mode: 'In-House', geofence: 'Within Geofence', distance: '68m', status: 'Late' },
  { id: 'EMP-006', name: 'Priya S', department: 'Quality Assurance', branch: 'HYD-01', checkIn: '09:25 AM', mode: 'Hybrid Approved', geofence: 'Remote Verified', distance: 'N/A', status: 'On-Time' },
  { id: 'EMP-007', name: 'Rahul M', department: 'DevOps & Cloud', branch: 'BLR-HQ', checkIn: '09:55 AM', mode: 'In-House', geofence: 'Within Geofence', distance: '82m', status: 'Late' },
  { id: 'EMP-008', name: 'Trupthi V', department: 'Database', branch: 'MAA-01', checkIn: '09:12 AM', mode: 'In-House', geofence: 'Within Geofence', distance: '18m', status: 'On-Time' },
  { id: 'EMP-009', name: 'Anuvrath P', department: 'Backend', branch: 'BLR-HQ', checkIn: '09:05 AM', mode: 'In-House', geofence: 'Within Geofence', distance: '31m', status: 'On-Time' },
  { id: 'EMP-010', name: 'Amrutha K', department: 'Quality Assurance', branch: 'BLR-HQ', checkIn: '09:18 AM', mode: 'In-House', geofence: 'Within Geofence', distance: '15m', status: 'On-Time' },
  { id: 'EMP-011', name: 'Sneha Patel', department: 'Product & Design', branch: 'BLR-HQ', checkIn: '09:14 AM', mode: 'Hybrid Approved', geofence: 'Remote Verified', distance: 'N/A', status: 'On-Time' },
  { id: 'EMP-012', name: 'Vikram Singh', department: 'Sales & Growth', branch: 'BLR-HQ', checkIn: '09:42 AM', mode: 'In-House', geofence: 'Within Geofence', distance: '55m', status: 'Late' },
  { id: 'EMP-019', name: 'Harish Rao', department: 'Engineering', branch: 'BLR-HQ', checkIn: '10:05 AM', mode: 'In-House', geofence: 'Within Geofence', distance: '38m', status: 'Late' },
];

// Mock dataset for Employees On Leave Today
const mockOnLeaveList: OnLeaveRecord[] = [
  { id: 'EMP-005', name: 'Arun Kumar', department: 'Human Resources', leaveType: 'Annual Leave', duration: '16 Nov â€“ 18 Nov 2026', reason: 'Family wedding event in native town', approvedBy: 'Admin (HR)' },
  { id: 'EMP-013', name: 'Suresh Raina', department: 'Engineering', leaveType: 'Casual Leave', duration: '16 Nov 2026 (1 Day)', reason: 'Personal family emergency', approvedBy: 'Jagadeesh K' },
  { id: 'EMP-014', name: 'Divya Nair', department: 'Marketing', leaveType: 'Annual Leave', duration: '15 Nov â€“ 19 Nov 2026', reason: 'Annual travel leave', approvedBy: 'Admin (HR)' },
  { id: 'EMP-015', name: 'Manoj Kumar', department: 'Operations', leaveType: 'Sick Leave', duration: '16 Nov 2026 (1 Day)', reason: 'Viral fever & doctor rest advisory', approvedBy: 'HR Executive' },
  { id: 'EMP-016', name: 'Ananya Roy', department: 'Finance & Accounts', leaveType: 'Maternity Leave', duration: '01 Nov â€“ 31 Dec 2026', reason: 'Approved Maternity Leave Plan', approvedBy: 'Admin (HR)' },
  { id: 'EMP-017', name: 'Rohit Sharma', department: 'Logistics', leaveType: 'Casual Leave', duration: '16 Nov â€“ 17 Nov 2026', reason: 'Relocation & personal errands', approvedBy: 'HR Executive' },
  { id: 'EMP-018', name: 'Deepa M', department: 'Engineering', leaveType: 'Sick Leave', duration: '16 Nov 2026 (1 Day)', reason: 'Dental appointment & recovery', approvedBy: 'Jagadeesh K' },
  { id: 'EMP-020', name: 'Kavita Menon', department: 'Customer Success', leaveType: 'Annual Leave', duration: '14 Nov â€“ 18 Nov 2026', reason: 'Pre-planned festival travel', approvedBy: 'Admin (HR)' },
];

// Mock dataset for Today's Late Arrivals
const mockLateArrivalsList: LateArrivalRecord[] = [
  { id: 'EMP-004', name: 'Ayesha N', department: 'Backend', checkIn: '09:48 AM', delay: '+18 mins', shift: 'General Shift (09:00 AM â€“ 06:00 PM)', reason: 'Traffic congestion on Outer Ring Road Flyover', regularizationStatus: 'Pending Request' },
  { id: 'EMP-007', name: 'Rahul M', department: 'DevOps & Cloud', checkIn: '09:55 AM', delay: '+25 mins', shift: 'General Shift (09:00 AM â€“ 06:00 PM)', reason: 'Emergency production database patch triage from home', regularizationStatus: 'Approved' },
  { id: 'EMP-012', name: 'Vikram Singh', department: 'Sales & Growth', checkIn: '09:42 AM', delay: '+12 mins', shift: 'General Shift (09:00 AM â€“ 06:00 PM)', reason: 'Client teleconference over-run before office commute', regularizationStatus: 'Action Needed' },
  { id: 'EMP-019', name: 'Harish Rao', department: 'Engineering', checkIn: '10:05 AM', delay: '+35 mins', shift: 'General Shift (09:00 AM â€“ 06:00 PM)', reason: 'Namma Metro Purple Line service interruption', regularizationStatus: 'Pending Request' },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeKpi, setActiveKpi] = useState<KpiType>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const isEmployee = user?.role === 'EMPLOYEE';
  const isManager = user?.role === 'MANAGER';
  const isAdminOrHr = user?.role === 'ADMIN' || user?.role === 'HR';

  // Check if current user has punched in
  const currentUserPresent = useMemo(() => {
    return mockPresentList.find((p) => p.id === user?.id) || {
      id: user?.id || 'EMP-001',
      name: user?.name || 'You',
      department: user?.department || 'Engineering',
      branch: 'BLR-HQ',
      checkIn: '09:02 AM',
      mode: 'In-House' as const,
      geofence: 'Within Geofence',
      distance: '14m',
      status: 'On-Time' as const
    };
  }, [user]);

  // Team-scoped records for Manager
  const teamMemberIds = user?.managedTeam || [];

  const teamPresentList = useMemo(() => {
    if (!isManager) return [];
    return mockPresentList.filter((p) => teamMemberIds.includes(p.id) || p.id === user?.id);
  }, [isManager, teamMemberIds, user?.id]);

  const teamOnLeaveList = useMemo(() => {
    if (!isManager) return [];
    return mockOnLeaveList.filter((l) => teamMemberIds.includes(l.id) || l.id === user?.id);
  }, [isManager, teamMemberIds, user?.id]);

  const teamLateList = useMemo(() => {
    if (!isManager) return [];
    return mockLateArrivalsList.filter((lt) => teamMemberIds.includes(lt.id) || lt.id === user?.id);
  }, [isManager, teamMemberIds, user?.id]);

  // Dynamic KPIs depending on user role
  const renderedKpis = useMemo(() => {
    if (isEmployee) {
      return [
        {
          id: 'my_attendance',
          title: 'My Today Punch',
          value: currentUserPresent.checkIn,
          subtitle: `${currentUserPresent.status} â€¢ ${currentUserPresent.mode}`,
          icon: Clock,
          accentColor: '#10B981',
          bgColor: '#ECFDF5'
        },
        {
          id: 'my_leave_balance',
          title: 'My Leave Balance',
          value: '14 Days',
          subtitle: 'Annual quota remaining',
          icon: CalendarPlus,
          accentColor: '#6338DF',
          bgColor: '#F5F3FF'
        },
        {
          id: 'my_regularization',
          title: 'My Regularizations',
          value: '1 Pending',
          subtitle: 'Missed check-out punch',
          icon: FileCheck2,
          accentColor: '#F59E0B',
          bgColor: '#FFFBEB'
        },
        {
          id: 'my_shift',
          title: 'Assigned Shift',
          value: 'General Shift',
          subtitle: '09:00 AM â€“ 06:00 PM',
          icon: Users,
          accentColor: '#3B82F6',
          bgColor: '#EFF6FF'
        }
      ];
    }

    if (isManager) {
      return [
        {
          id: 'team_size',
          title: 'Assigned Team',
          value: `${teamMemberIds.length} Staff`,
          subtitle: 'Direct reports assigned',
          icon: Users,
          accentColor: '#3B82F6',
          bgColor: '#EFF6FF'
        },
        {
          id: 'present',
          title: 'Team Present',
          value: `${teamPresentList.length} Present`,
          subtitle: 'Checked in today',
          icon: UserCheck,
          accentColor: '#10B981',
          bgColor: '#ECFDF5'
        },
        {
          id: 'on_leave',
          title: 'Team On Leave',
          value: `${teamOnLeaveList.length} On Leave`,
          subtitle: 'Active leaves today',
          icon: UserX,
          accentColor: '#F59E0B',
          bgColor: '#FFFBEB'
        },
        {
          id: 'late',
          title: 'Team Late Arrivals',
          value: `${teamLateList.length} Late`,
          subtitle: 'Post cutoff today',
          icon: Clock,
          accentColor: '#EF4444',
          bgColor: '#FEF2F2'
        }
      ];
    }

    // Default: Admin / HR org-wide KPIs
    return mockKpis.map((k) => ({
      ...k,
      icon: k.iconName === 'Users' ? Users : k.iconName === 'UserCheck' ? UserCheck : k.iconName === 'UserX' ? UserX : Clock
    }));
  }, [isEmployee, isManager, currentUserPresent, teamMemberIds, teamPresentList, teamOnLeaveList, teamLateList]);

  // Role-customized Quick Actions
  const quickActions = useMemo(() => {
    if (isEmployee) {
      return [
        {
          title: 'Mark GPS Punch',
          icon: ClipboardCheck,
          color: '#059669',
          action: () => navigate('/attendance')
        },
        {
          title: 'Apply for Leave',
          icon: CalendarPlus,
          color: '#0284C7',
          action: () => navigate('/leaves')
        },
        {
          title: 'Punch Correction',
          icon: FileCheck2,
          color: '#D97706',
          action: () => navigate('/regularization')
        },
        {
          title: 'My Profile',
          icon: User,
          color: '#6338DF',
          action: () => navigate('/profile')
        }
      ];
    }

    if (isManager) {
      return [
        {
          title: 'Review Hybrid',
          icon: Laptop,
          color: '#6338DF',
          action: () => navigate('/hybrid-approvals')
        },
        {
          title: 'Review Leaves',
          icon: CalendarPlus,
          color: '#0284C7',
          action: () => navigate('/leaves')
        },
        {
          title: 'Team Attendance',
          icon: ClipboardCheck,
          color: '#059669',
          action: () => navigate('/attendance')
        },
        {
          title: 'Regularizations',
          icon: FileCheck2,
          color: '#D97706',
          action: () => navigate('/regularization')
        }
      ];
    }

    // Admin & HR full actions
    return [
      {
        title: 'Add Employee',
        icon: UserPlus,
        color: '#6338DF',
        action: () => navigate('/employees?action=add')
      },
      {
        title: 'Apply Leave',
        icon: CalendarPlus,
        color: '#0284C7',
        action: () => navigate('/leaves')
      },
      {
        title: 'Check Attendance',
        icon: ClipboardCheck,
        color: '#059669',
        action: () => navigate('/attendance')
      },
      {
        title: 'Generate Report',
        icon: FileSpreadsheet,
        color: '#D97706',
        action: () => navigate('/reports')
      }
    ];
  }, [isEmployee, isManager, navigate]);

  // Leave Requests scoped by role
  const visibleLeaveRequests = useMemo(() => {
    if (isEmployee) {
      // Employee sees only their own requests
      return [
        {
          id: 'LR-100',
          employeeName: user?.name || 'You',
          leaveType: 'Annual Leave' as const,
          status: 'Pending' as const,
          startDate: '24 Nov 2026',
          endDate: '25 Nov 2026'
        }
      ];
    }

    if (isManager) {
      // Manager sees team requests
      return mockLeaveRequests.filter((req) => {
        const emp = mockEmployees.find((e) => e.name === req.employeeName);
        return emp && (teamMemberIds.includes(emp.id) || emp.id === user?.id);
      });
    }

    // Admin/HR sees all
    return mockLeaveRequests;
  }, [isEmployee, isManager, user, teamMemberIds]);

  // Filtered queries inside modals (restricted to authorized records)
  const filteredEmployees = useMemo(() => {
    if (!isAdminOrHr) return [];
    return mockEmployees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, isAdminOrHr]);

  const filteredPresentList = useMemo(() => {
    let source = mockPresentList;
    if (isEmployee) {
      source = [currentUserPresent];
    } else if (isManager) {
      source = teamPresentList;
    }
    return source.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, isEmployee, isManager, currentUserPresent, teamPresentList]);

  const filteredOnLeaveList = useMemo(() => {
    let source = mockOnLeaveList;
    if (isEmployee) {
      source = [];
    } else if (isManager) {
      source = teamOnLeaveList;
    }
    return source.filter(
      (l) =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, isEmployee, isManager, teamOnLeaveList]);

  const filteredLateArrivals = useMemo(() => {
    let source = mockLateArrivalsList;
    if (isEmployee) {
      source = [];
    } else if (isManager) {
      source = teamLateList;
    }
    return source.filter(
      (lt) =>
        lt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lt.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, isEmployee, isManager, teamLateList]);

  const handleOpenKpiModal = (id: string) => {
    if (isEmployee && (id === 'employees' || id === 'late' || id === 'on_leave')) {
      // Employees cannot view org-wide headcount directories
      return;
    }
    setSearchTerm('');
    setActiveKpi(id as KpiType);
  };

  const handleCloseModal = () => {
    setActiveKpi(null);
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      {/* Role Banner / Welcome Header */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Welcome back, {user?.name || 'Employee'}
            </h2>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
              user?.role === 'ADMIN' ? 'bg-purple-100 text-[#6338DF]' :
              user?.role === 'HR' ? 'bg-blue-100 text-blue-700' :
              user?.role === 'MANAGER' ? 'bg-amber-100 text-amber-700' :
              'bg-emerald-100 text-emerald-700'
            }`}>
              {user?.role} PORTAL
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {isEmployee && 'Self-service dashboard â€¢ Viewing your attendance, leave balances, and punch logs only.'}
            {isManager && `Engineering Team Lead â€¢ Managing ${teamMemberIds.length} assigned team members.`}
            {isAdminOrHr && 'Enterprise Administration â€¢ Real-time workforce management & attendance compliance.'}
          </p>
        </div>

        {isEmployee && (
          <Button
            variant="primary"
            size="sm"
            icon={<ClipboardCheck size={16} />}
            onClick={() => navigate('/attendance')}
          >
            Mark GPS Check-In
          </Button>
        )}
      </div>

      {/* 1. Dynamic KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderedKpis.map((kpi) => {
          const Icon = kpi.icon;
          const isClickable = !isEmployee || kpi.id === 'my_attendance';

          return (
            <button
              key={kpi.id}
              type="button"
              disabled={!isClickable}
              onClick={() => handleOpenKpiModal(kpi.id)}
              className={`group block w-full text-left focus:outline-none focus:ring-2 focus:ring-[#6338DF] rounded-xl transition-all ${
                !isClickable ? 'cursor-default' : 'hover:scale-[1.01]'
              }`}
            >
              <Card
                className={`flex items-center justify-between border border-gray-100 transition-all relative overflow-hidden h-full ${
                  isClickable ? 'group-hover:border-purple-300 group-hover:shadow-md' : ''
                }`}
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider group-hover:text-[#6338DF] transition-colors">
                      {kpi.title}
                    </p>
                    {isClickable && (
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-[#6338DF] bg-purple-50 px-1.5 py-0.5 rounded">
                        View &rarr;
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#161A3D] mt-1 group-hover:scale-105 origin-left transition-transform">
                    {kpi.value}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1 font-medium">
                    <TrendingUp size={12} className="text-emerald-500" />
                    {kpi.subtitle}
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110"
                  style={{ backgroundColor: kpi.bgColor, color: kpi.accentColor }}
                >
                  <Icon size={22} />
                </div>
              </Card>
            </button>
          );
        })}
      </div>

      {/* 2. Middle Row: Attendance Line Chart & Leave Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Chart (2 cols) */}
        <Card className="lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {isEmployee ? 'My Weekly Attendance Trends' : isManager ? 'Assigned Team Attendance' : 'Organization Attendance Overview'}
              </h2>
              <p className="text-xs text-gray-500">
                {isEmployee ? 'Daily check-in accuracy and office hours logged' : 'Weekly workforce turnout and on-time compliance'}
              </p>
            </div>
            {!isEmployee && (
              <button
                onClick={() => handleOpenKpiModal('present')}
                className="text-xs font-semibold text-[#6338DF] hover:underline flex items-center gap-1 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100"
              >
                <span>Avg. 93% Present</span>
                <ArrowUpRight size={13} />
              </button>
            )}
          </div>

          {/* SVG Line Chart */}
          <div className="h-56 sm:h-64 w-full relative pt-4 pb-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6338DF" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#6338DF" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="0" y1="40" x2="500" y2="40" stroke="#F1F1F5" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="#F1F1F5" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#F1F1F5" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="190" x2="500" y2="190" stroke="#E5E7EB" strokeWidth="1" />

              <polygon
                fill="url(#purpleGrad)"
                points="30,120 130,50 250,90 370,40 470,70 470,190 30,190"
              />

              <polyline
                fill="none"
                stroke="#6338DF"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="30,120 130,50 250,90 370,40 470,70"
              />

              {[
                { x: 30, y: 120, label: isEmployee ? '9h 00m' : '138' },
                { x: 130, y: 50, label: isEmployee ? '8h 30m' : '144' },
                { x: 250, y: 90, label: isEmployee ? '9h 10m' : '140' },
                { x: 370, y: 40, label: isEmployee ? '8h 47m' : '146' },
                { x: 470, y: 70, label: isEmployee ? '9h 09m' : '142' }
              ].map((pt, idx) => (
                <g key={idx}>
                  <circle cx={pt.x} cy={pt.y} r="6" fill="#FFFFFF" stroke="#6338DF" strokeWidth="3" />
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    textAnchor="middle"
                    className="text-[10px] font-semibold fill-gray-600"
                  >
                    {pt.label}
                  </text>
                </g>
              ))}
            </svg>

            <div className="flex justify-between px-4 sm:px-6 mt-2 text-xs font-semibold text-gray-500">
              {mockAttendanceTrend.map((d) => (
                <span key={d.day}>{d.day}</span>
              ))}
            </div>
          </div>
        </Card>

        {/* Leave Requests Box (1 col) - Scoped */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {isEmployee ? 'My Leave Applications' : isManager ? 'Team Leave Requests' : 'Leave Applications'}
              </h2>
              <p className="text-xs text-gray-500">
                {isEmployee ? 'Status of your submitted time-off' : 'Pending approvals'}
              </p>
            </div>
            {!isEmployee && (
              <button
                onClick={() => handleOpenKpiModal('on_leave')}
                className="text-xs font-semibold text-[#6338DF] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowUpRight size={13} />
              </button>
            )}
          </div>

          <div className="divide-y divide-gray-100">
            {visibleLeaveRequests.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400">
                No active leave applications found.
              </div>
            ) : (
              visibleLeaveRequests.map((req) => (
                <div key={req.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-purple-100 text-[#6338DF] font-bold text-xs flex items-center justify-center shrink-0">
                      {req.employeeName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {req.employeeName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{req.leaveType}</p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <Badge variant={req.status === 'Approved' ? 'present' : 'pending'}>
                      {req.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/leaves')}
              className="w-full"
            >
              {isEmployee ? 'Apply for Leave' : 'Open Leave Portal'}
            </Button>
          </div>
        </Card>
      </div>

      {/* 3. Quick Actions Grid - Strictly Role Configured */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">Authorized Actions</h2>
          <span className="text-xs text-gray-500">Filtered by role: {user?.role}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.title}
                onClick={action.action}
                className="group flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all text-center"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 shadow-sm transition-transform group-hover:scale-105"
                  style={{ backgroundColor: `${action.color}15`, color: action.color }}
                >
                  <Icon size={22} />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-[#6338DF]">
                  {action.title}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* ============================================================== */}
      {/* 4. MODALS - Filtered to authorized records only                */}
      {/* ============================================================== */}

      {/* MODAL 1: WORKFORCE / EMPLOYEES (Admin & HR only) */}
      {isAdminOrHr && (
        <Modal
          isOpen={activeKpi === 'employees'}
          onClose={handleCloseModal}
          title="Workforce Directory (154 Total Staff)"
          subtitle="Active registered employee personnel across all company branches"
          badge="Total: 154"
          maxWidth="2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-gray-500">
                Showing {filteredEmployees.length} of {mockEmployees.length} registered profiles
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCloseModal}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<ExternalLink size={14} />}
                  onClick={() => {
                    handleCloseModal();
                    navigate('/employees');
                  }}
                >
                  Full Employee Directory
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                <p className="text-[11px] text-blue-600 font-semibold uppercase">Total Workforce</p>
                <p className="text-xl font-extrabold text-[#161A3D]">154</p>
              </div>
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <p className="text-[11px] text-emerald-600 font-semibold uppercase">Active Status</p>
                <p className="text-xl font-extrabold text-emerald-700">146</p>
              </div>
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
                <p className="text-[11px] text-amber-600 font-semibold uppercase">On Leave</p>
                <p className="text-xl font-extrabold text-amber-700">8</p>
              </div>
              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100">
                <p className="text-[11px] text-[#6338DF] font-semibold uppercase">Branches</p>
                <p className="text-xl font-extrabold text-[#6338DF]">3 Offices</p>
              </div>
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search size={15} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter employees by name, ID, department..."
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6338DF]"
              />
            </div>

            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Employee</th>
                    <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Department</th>
                    <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Designation</th>
                    <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="px-3.5 py-2.5 font-medium text-gray-900 whitespace-nowrap">
                        <div>
                          <p className="font-semibold">{emp.name}</p>
                          <span className="font-mono text-[10px] text-gray-500">{emp.id}</span>
                        </div>
                      </td>
                      <td className="px-3.5 py-2.5 text-gray-700 whitespace-nowrap">{emp.department}</td>
                      <td className="px-3.5 py-2.5 text-gray-600 whitespace-nowrap">{emp.designation}</td>
                      <td className="px-3.5 py-2.5 whitespace-nowrap">
                        <Badge variant={emp.status === 'Active' ? 'present' : 'absent'}>
                          {emp.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 2: PRESENT EMPLOYEES (Scoped to permissions) */}
      <Modal
        isOpen={activeKpi === 'present'}
        onClose={handleCloseModal}
        title={isEmployee ? 'My Punch Record' : isManager ? 'Team Present Today' : "Today's Present Employees"}
        subtitle="GPS geofenced and verified punches logged today"
        badge={isEmployee ? 'Self Record' : `${filteredPresentList.length} Present`}
        maxWidth="2xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-gray-500">
              {filteredPresentList.length} verified records
            </span>
            <Button variant="outline" size="sm" onClick={handleCloseModal}>
              Close
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="overflow-x-auto border border-gray-100 rounded-xl">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Employee</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Check-In Time</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Work Mode</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPresentList.map((p) => (
                  <tr key={p.id} className="hover:bg-emerald-50/20 transition-colors">
                    <td className="px-3.5 py-2.5 font-medium text-gray-900 whitespace-nowrap">
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <span className="font-mono text-[10px] text-gray-500">{p.id} â€¢ {p.department}</span>
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5 font-mono font-bold text-emerald-700 whitespace-nowrap">
                      {p.checkIn}
                    </td>
                    <td className="px-3.5 py-2.5 text-gray-700 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">
                        <Building size={12} className="text-gray-400" />
                        {p.mode}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap">
                      <Badge variant={p.status === 'On-Time' ? 'present' : 'late'}>
                        {p.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* MODAL 3: ON LEAVE LIST (Manager & Admin/HR only) */}
      {!isEmployee && (
        <Modal
          isOpen={activeKpi === 'on_leave'}
          onClose={handleCloseModal}
          title={isManager ? 'Team Members On Leave' : 'Employees On Leave Today'}
          subtitle="Approved leave records active for the current work date"
          badge={`${filteredOnLeaveList.length} Absent`}
          maxWidth="2xl"
          footer={
            <Button variant="outline" size="sm" onClick={handleCloseModal}>
              Close
            </Button>
          }
        >
          <div className="overflow-x-auto border border-gray-100 rounded-xl">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Employee</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Leave Type</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Duration</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOnLeaveList.map((l) => (
                  <tr key={l.id} className="hover:bg-amber-50/20 transition-colors">
                    <td className="px-3.5 py-2.5 font-medium text-gray-900 whitespace-nowrap">
                      <div>
                        <p className="font-semibold">{l.name}</p>
                        <span className="font-mono text-[10px] text-gray-500">{l.id}</span>
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5 text-amber-700 font-semibold whitespace-nowrap">
                      {l.leaveType}
                    </td>
                    <td className="px-3.5 py-2.5 text-gray-700 whitespace-nowrap">{l.duration}</td>
                    <td className="px-3.5 py-2.5 text-gray-600 max-w-xs truncate">{l.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}

      {/* MODAL 4: LATE ARRIVALS (Manager & Admin/HR only) */}
      {!isEmployee && (
        <Modal
          isOpen={activeKpi === 'late'}
          onClose={handleCloseModal}
          title={isManager ? 'Team Late Arrivals' : 'Late Check-In Exceptions'}
          subtitle="Punches registered after 09:30 AM cutoff"
          badge={`${filteredLateArrivals.length} Exceptions`}
          maxWidth="2xl"
          footer={
            <Button variant="outline" size="sm" onClick={handleCloseModal}>
              Close
            </Button>
          }
        >
          <div className="overflow-x-auto border border-gray-100 rounded-xl">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Employee</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Check-In</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Delay</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLateArrivals.map((row) => (
                  <tr key={row.id} className="hover:bg-red-50/20 transition-colors">
                    <td className="px-3.5 py-2.5 font-medium text-gray-900 whitespace-nowrap">
                      <div>
                        <p className="font-semibold">{row.name}</p>
                        <span className="font-mono text-[10px] text-gray-500">{row.id}</span>
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5 font-mono font-bold text-red-600 whitespace-nowrap">{row.checkIn}</td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-red-100 text-red-700">
                        {row.delay}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap">
                      <Badge variant={row.regularizationStatus === 'Approved' ? 'present' : 'pending'}>
                        {row.regularizationStatus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
};
