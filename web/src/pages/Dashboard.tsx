import React from 'react';
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
  TrendingUp
} from 'lucide-react';
import { mockKpis, mockAttendanceTrend, mockLeaveRequests } from '../data/mockData';
import { Card, Badge, Button } from '../components/ui';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

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
      action: () => navigate('/coming-soon/leaves')
    },
    {
      title: 'Check Attendance',
      icon: ClipboardCheck,
      color: '#059669',
      action: () => navigate('/coming-soon/attendance')
    },
    {
      title: 'Generate Report',
      icon: FileSpreadsheet,
      color: '#D97706',
      action: () => navigate('/coming-soon/reports')
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockKpis.map((kpi) => (
          <Card key={kpi.id} hoverable className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {kpi.title}
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#161A3D] mt-1">
                {kpi.value}
              </h3>
              <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1 font-medium">
                <TrendingUp size={12} className="text-emerald-500" />
                {kpi.subtitle}
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: kpi.bgColor }}
            >
              {renderKpiIcon(kpi.iconName, kpi.accentColor)}
            </div>
          </Card>
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
            <Badge variant="purple">Avg. 93% Present</Badge>
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
              onClick={() => navigate('/coming-soon/leaves')}
              className="text-xs font-semibold text-[#6338DF] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
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

          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/coming-soon/leaves')}
              className="w-full"
            >
              Review Pending Leaves
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
    </div>
  );
};
