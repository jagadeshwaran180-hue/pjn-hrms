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
  ShieldCheck,
  AlertTriangle,
  Building,
  Laptop
} from 'lucide-react';
import { mockKpis, mockAttendanceTrend, mockLeaveRequests, mockEmployees } from '../data/mockData';
import { Card, Badge, Button, Modal } from '../components/ui';

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
  { id: 'EMP-005', name: 'Arun Kumar', department: 'Human Resources', leaveType: 'Annual Leave', duration: '16 Nov – 18 Nov 2026', reason: 'Family wedding event in native town', approvedBy: 'Admin (HR)' },
  { id: 'EMP-013', name: 'Suresh Raina', department: 'Engineering', leaveType: 'Casual Leave', duration: '16 Nov 2026 (1 Day)', reason: 'Personal family emergency', approvedBy: 'Jagadeesh K' },
  { id: 'EMP-014', name: 'Divya Nair', department: 'Marketing', leaveType: 'Annual Leave', duration: '15 Nov – 19 Nov 2026', reason: 'Annual travel leave', approvedBy: 'Admin (HR)' },
  { id: 'EMP-015', name: 'Manoj Kumar', department: 'Operations', leaveType: 'Sick Leave', duration: '16 Nov 2026 (1 Day)', reason: 'Viral fever & doctor rest advisory', approvedBy: 'HR Executive' },
  { id: 'EMP-016', name: 'Ananya Roy', department: 'Finance & Accounts', leaveType: 'Maternity Leave', duration: '01 Nov – 31 Dec 2026', reason: 'Approved Maternity Leave Plan', approvedBy: 'Admin (HR)' },
  { id: 'EMP-017', name: 'Rohit Sharma', department: 'Logistics', leaveType: 'Casual Leave', duration: '16 Nov – 17 Nov 2026', reason: 'Relocation & personal errands', approvedBy: 'HR Executive' },
  { id: 'EMP-018', name: 'Deepa M', department: 'Engineering', leaveType: 'Sick Leave', duration: '16 Nov 2026 (1 Day)', reason: 'Dental appointment & recovery', approvedBy: 'Jagadeesh K' },
  { id: 'EMP-020', name: 'Kavita Menon', department: 'Customer Success', leaveType: 'Annual Leave', duration: '14 Nov – 18 Nov 2026', reason: 'Pre-planned festival travel', approvedBy: 'Admin (HR)' },
];

// Mock dataset for Today's Late Arrivals
const mockLateArrivalsList: LateArrivalRecord[] = [
  { id: 'EMP-004', name: 'Ayesha N', department: 'Backend', checkIn: '09:48 AM', delay: '+18 mins', shift: 'General Shift (09:00 AM – 06:00 PM)', reason: 'Traffic congestion on Outer Ring Road Flyover', regularizationStatus: 'Pending Request' },
  { id: 'EMP-007', name: 'Rahul M', department: 'DevOps & Cloud', checkIn: '09:55 AM', delay: '+25 mins', shift: 'General Shift (09:00 AM – 06:00 PM)', reason: 'Emergency production database patch triage from home', regularizationStatus: 'Approved' },
  { id: 'EMP-012', name: 'Vikram Singh', department: 'Sales & Growth', checkIn: '09:42 AM', delay: '+12 mins', shift: 'General Shift (09:00 AM – 06:00 PM)', reason: 'Client teleconference over-run before office commute', regularizationStatus: 'Action Needed' },
  { id: 'EMP-019', name: 'Harish Rao', department: 'Engineering', checkIn: '10:05 AM', delay: '+35 mins', shift: 'General Shift (09:00 AM – 06:00 PM)', reason: 'Namma Metro Purple Line service interruption', regularizationStatus: 'Pending Request' },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Active KPI modal state
  const [activeKpi, setActiveKpi] = useState<KpiType>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const renderKpiIcon = (name: string, color: string) => {
    switch (name) {
      case 'Users':
        return <Users size={22} style={{ color }} />;
      case 'UserCheck':
        return <UserCheck size={22} style={{ color }} />;
      case 'UserX':
        return <UserX size={22} style={{ color }} />;
      case 'Clock':
        return <Clock size={22} style={{ color }} />;
      default:
        return <Users size={22} style={{ color }} />;
    }
  };

  const quickActions = [
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

  // Filtered queries inside modals
  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const filteredPresentList = useMemo(() => {
    return mockPresentList.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.branch.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const filteredOnLeaveList = useMemo(() => {
    return mockOnLeaveList.filter(
      (l) =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.leaveType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const filteredLateArrivals = useMemo(() => {
    return mockLateArrivalsList.filter(
      (lt) =>
        lt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lt.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lt.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleOpenKpiModal = (id: string) => {
    setSearchTerm('');
    setActiveKpi(id as KpiType);
  };

  const handleCloseModal = () => {
    setActiveKpi(null);
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      {/* 1. KPI Cards Row - Interactive Clickable Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockKpis.map((kpi) => (
          <button
            key={kpi.id}
            type="button"
            onClick={() => handleOpenKpiModal(kpi.id)}
            className="group block w-full text-left focus:outline-none focus:ring-2 focus:ring-[#6338DF] rounded-xl transition-all"
            aria-label={`View detailed ${kpi.title} information`}
          >
            <Card
              hoverable
              className="flex items-center justify-between border border-gray-100 group-hover:border-purple-300 group-hover:shadow-md transition-all relative overflow-hidden h-full"
            >
              <div className="min-w-0 flex-1 pr-2">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider group-hover:text-[#6338DF] transition-colors">
                    {kpi.title}
                  </p>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-[#6338DF] bg-purple-50 px-1.5 py-0.5 rounded">
                    View &rarr;
                  </span>
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
                style={{ backgroundColor: kpi.bgColor }}
              >
                {renderKpiIcon(kpi.iconName, kpi.accentColor)}
              </div>
            </Card>
          </button>
        ))}
      </div>

      {/* 2. Middle Row: Attendance Line Chart & Leave Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Overview Chart (2 cols) */}
        <Card className="lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Attendance Overview</h2>
              <p className="text-xs text-gray-500">Weekly workforce attendance trends (Mon - Fri)</p>
            </div>
            <button
              onClick={() => handleOpenKpiModal('present')}
              className="text-xs font-semibold text-[#6338DF] hover:underline flex items-center gap-1 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100"
            >
              <span>Avg. 93% Present</span>
              <ArrowUpRight size={13} />
            </button>
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

              {/* Horizontal Grid lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#F1F1F5" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="#F1F1F5" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#F1F1F5" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="190" x2="500" y2="190" stroke="#E5E7EB" strokeWidth="1" />

              {/* Shaded Area fill */}
              <polygon
                fill="url(#purpleGrad)"
                points="
                  30,120
                  130,50
                  250,90
                  370,40
                  470,70
                  470,190
                  30,190
                "
              />

              {/* Main Line */}
              <polyline
                fill="none"
                stroke="#6338DF"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="
                  30,120
                  130,50
                  250,90
                  370,40
                  470,70
                "
              />

              {/* Data Points */}
              {[
                { x: 30, y: 120, label: '138' },
                { x: 130, y: 50, label: '144' },
                { x: 250, y: 90, label: '140' },
                { x: 370, y: 40, label: '146' },
                { x: 470, y: 70, label: '142' }
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

            {/* X-Axis Day Labels */}
            <div className="flex justify-between px-4 sm:px-6 mt-2 text-xs font-semibold text-gray-500">
              {mockAttendanceTrend.map((d) => (
                <span key={d.day}>{d.day}</span>
              ))}
            </div>
          </div>
        </Card>

        {/* Leave Requests Box (1 col) */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Leave Requests</h2>
              <p className="text-xs text-gray-500">Recent applications</p>
            </div>
            <button
              onClick={() => handleOpenKpiModal('on_leave')}
              className="text-xs font-semibold text-[#6338DF] hover:underline flex items-center gap-1"
            >
              <span>View On Leave</span>
              <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {mockLeaveRequests.map((req) => (
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
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenKpiModal('on_leave')}
              className="flex-1"
            >
              On-Leave List
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/leaves')}
              className="flex-1"
            >
              Manage Leaves
            </Button>
          </div>
        </Card>
      </div>

      {/* 3. Quick Actions Grid */}
      <Card>
        <h2 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h2>
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
      {/* 4. MODALS FOR EACH OF THE 4 KPI BUTTONS                         */}
      {/* ============================================================== */}

      {/* MODAL 1: TOTAL EMPLOYEES */}
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
          {/* Quick Metrics & Search */}
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

          {/* Search bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={15} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter employees by name, ID, department or designation..."
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6338DF]"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-gray-100 rounded-xl">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Employee</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Department</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Designation</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Email</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Status</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="px-3.5 py-2.5 font-medium text-gray-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-purple-100 text-[#6338DF] flex items-center justify-center font-bold text-xs shrink-0">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{emp.name}</p>
                          <span className="font-mono text-[10px] text-gray-500">{emp.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5 text-gray-700 whitespace-nowrap">{emp.department}</td>
                    <td className="px-3.5 py-2.5 text-gray-700 whitespace-nowrap">{emp.designation}</td>
                    <td className="px-3.5 py-2.5 text-gray-500 whitespace-nowrap font-mono text-[11px]">{emp.email}</td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap">
                      <Badge variant={emp.status === 'Active' ? 'present' : 'pending'}>
                        {emp.status}
                      </Badge>
                    </td>
                    <td className="px-3.5 py-2.5 text-gray-500 whitespace-nowrap">{emp.joinDate || '12 Jan 2023'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* MODAL 2: PRESENT TODAY */}
      <Modal
        isOpen={activeKpi === 'present'}
        onClose={handleCloseModal}
        title="Present Today: Live Turnout (142 Logged)"
        subtitle="Verified check-ins through GPS 100m geofence and approved hybrid passes"
        badge="Turnout: 92.2%"
        maxWidth="2xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-emerald-700 font-medium">
              128 In-House Office Pushes • 14 Approved Hybrid Passes
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
                  navigate('/attendance');
                }}
              >
                Open GPS Attendance
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Key Insights Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-[11px] text-emerald-700 font-semibold uppercase flex items-center gap-1">
                <Building size={12} /> In-House Office
              </p>
              <p className="text-xl font-extrabold text-emerald-800">128</p>
              <p className="text-[10px] text-emerald-600 mt-0.5">100m Geofence Validated</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
              <p className="text-[11px] text-[#6338DF] font-semibold uppercase flex items-center gap-1">
                <Laptop size={12} /> Hybrid WFH
              </p>
              <p className="text-xl font-extrabold text-[#6338DF]">14</p>
              <p className="text-[10px] text-purple-600 mt-0.5">HR Pre-Approved</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-[11px] text-blue-700 font-semibold uppercase">On-Time Turnout</p>
              <p className="text-xl font-extrabold text-blue-800">138</p>
              <p className="text-[10px] text-blue-600 mt-0.5">Before 09:30 AM</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-[11px] text-amber-700 font-semibold uppercase">Late Arrivals</p>
              <p className="text-xl font-extrabold text-amber-800">4</p>
              <p className="text-[10px] text-amber-600 mt-0.5">Grace Exceeded</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={15} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search present personnel by name, ID, branch or department..."
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6338DF]"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-gray-100 rounded-xl">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Employee</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Branch</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Check-In</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Attendance Mode</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">GPS Validation</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Punctuality</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPresentList.map((row) => (
                  <tr key={row.id} className="hover:bg-emerald-50/20 transition-colors">
                    <td className="px-3.5 py-2.5 font-medium text-gray-900 whitespace-nowrap">
                      <div>
                        <p className="font-semibold">{row.name}</p>
                        <span className="font-mono text-[10px] text-gray-500">{row.id} • {row.department}</span>
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5 text-gray-700 whitespace-nowrap">
                      <span className="font-medium bg-gray-100 px-2 py-0.5 rounded text-[11px]">{row.branch}</span>
                    </td>
                    <td className="px-3.5 py-2.5 font-mono font-bold text-gray-900 whitespace-nowrap">{row.checkIn}</td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        row.mode === 'In-House' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-purple-50 text-[#6338DF] border border-purple-200'
                      }`}>
                        {row.mode === 'In-House' ? <Building size={10} /> : <Laptop size={10} />}
                        {row.mode}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-gray-600 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <ShieldCheck size={13} className="text-emerald-600" />
                        <span>{row.geofence}</span>
                        {row.distance !== 'N/A' && (
                          <span className="text-[10px] text-gray-400 font-mono">({row.distance})</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap">
                      <Badge variant={row.status === 'On-Time' ? 'present' : 'pending'}>
                        {row.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* MODAL 3: EMPLOYEES ON LEAVE */}
      <Modal
        isOpen={activeKpi === 'on_leave'}
        onClose={handleCloseModal}
        title="Employees On Leave Today (8 Approved)"
        subtitle="Approved leave leaves roster with approved dates, duration and HR decisions"
        badge="Active Leaves: 8"
        maxWidth="2xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-amber-700 font-medium">
              All 8 leaves are pre-approved by designated department leads or HR
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
                  navigate('/leaves');
                }}
              >
                Go to Leave Approvals
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Quick Leave Type Summary */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-center">
              <p className="text-[11px] text-[#6338DF] font-semibold uppercase">Annual Leave</p>
              <p className="text-2xl font-extrabold text-[#6338DF] mt-0.5">4</p>
              <p className="text-[10px] text-gray-500">Scheduled Time-Off</p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-center">
              <p className="text-[11px] text-red-600 font-semibold uppercase">Sick Leave</p>
              <p className="text-2xl font-extrabold text-red-700 mt-0.5">2</p>
              <p className="text-[10px] text-gray-500">Medical Certificates Logged</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-center">
              <p className="text-[11px] text-amber-700 font-semibold uppercase">Casual / Maternity</p>
              <p className="text-2xl font-extrabold text-amber-800 mt-0.5">2</p>
              <p className="text-[10px] text-gray-500">Approved Special Leave</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={15} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search leaves by employee name, ID, type or reason..."
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6338DF]"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-gray-100 rounded-xl">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Employee</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Leave Type</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Date Range</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Reason / Details</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Approved By</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOnLeaveList.map((row) => (
                  <tr key={row.id} className="hover:bg-amber-50/20 transition-colors">
                    <td className="px-3.5 py-2.5 font-medium text-gray-900 whitespace-nowrap">
                      <div>
                        <p className="font-semibold">{row.name}</p>
                        <span className="font-mono text-[10px] text-gray-500">{row.id} • {row.department}</span>
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                        row.leaveType.includes('Sick') ? 'bg-red-50 text-red-700 border border-red-200' :
                        row.leaveType.includes('Annual') ? 'bg-purple-50 text-[#6338DF] border border-purple-200' :
                        'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {row.leaveType}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-gray-700 whitespace-nowrap font-medium">{row.duration}</td>
                    <td className="px-3.5 py-2.5 text-gray-600 max-w-xs truncate" title={row.reason}>{row.reason}</td>
                    <td className="px-3.5 py-2.5 text-gray-500 whitespace-nowrap">{row.approvedBy}</td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap">
                      <Badge variant="present">Approved</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* MODAL 4: LATE ARRIVALS */}
      <Modal
        isOpen={activeKpi === 'late'}
        onClose={handleCloseModal}
        title="Late Arrivals Today (4 Staff After 09:30 AM)"
        subtitle="Workforce check-ins logged after the standard shift grace period"
        badge="Grace Cutoff: 09:30 AM"
        maxWidth="2xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-red-600 font-medium">
              Late punch-ins can be regularized upon manager justification
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
                  navigate('/regularization');
                }}
              >
                Attendance Regularization
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Policy Overview Callout */}
          <div className="p-3.5 bg-red-50/60 rounded-xl border border-red-200/80 flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <div className="text-xs text-red-800">
              <p className="font-bold">Shift Policy Rule: 15-Minute Grace Period</p>
              <p className="mt-0.5 text-red-700">
                Official shift starts at 09:00 AM. Check-in between 09:00 – 09:15 AM is fully on-time.
                Arrivals after 09:30 AM require regularized remarks or will impact monthly punctuality scores.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-center">
              <p className="text-[11px] text-amber-700 font-semibold uppercase">Total Late Today</p>
              <p className="text-2xl font-extrabold text-amber-800 mt-0.5">4 Staff</p>
              <p className="text-[10px] text-gray-500">2.8% of Total Turnout</p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-center">
              <p className="text-[11px] text-red-600 font-semibold uppercase">Avg Delay</p>
              <p className="text-2xl font-extrabold text-red-700 mt-0.5">+22.5 mins</p>
              <p className="text-[10px] text-gray-500">Post 09:30 AM Cutoff</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-center">
              <p className="text-[11px] text-[#6338DF] font-semibold uppercase">Pending Requests</p>
              <p className="text-2xl font-extrabold text-[#6338DF] mt-0.5">2 Applied</p>
              <p className="text-[10px] text-gray-500">Regularization in Review</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={15} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search late arrivals by name, ID or explanation reason..."
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6338DF]"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-gray-100 rounded-xl">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Employee</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Actual Check-In</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Delay Time</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Assigned Shift</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Reason / Remarks</th>
                  <th className="px-3.5 py-2.5 text-left font-semibold text-gray-600">Regularization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLateArrivals.map((row) => (
                  <tr key={row.id} className="hover:bg-red-50/20 transition-colors">
                    <td className="px-3.5 py-2.5 font-medium text-gray-900 whitespace-nowrap">
                      <div>
                        <p className="font-semibold">{row.name}</p>
                        <span className="font-mono text-[10px] text-gray-500">{row.id} • {row.department}</span>
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5 font-mono font-bold text-red-600 whitespace-nowrap">{row.checkIn}</td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-red-100 text-red-700">
                        {row.delay}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-gray-600 whitespace-nowrap">{row.shift}</td>
                    <td className="px-3.5 py-2.5 text-gray-600 max-w-xs truncate" title={row.reason}>{row.reason}</td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        row.regularizationStatus === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        row.regularizationStatus === 'Pending Request' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {row.regularizationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </div>
  );
};
