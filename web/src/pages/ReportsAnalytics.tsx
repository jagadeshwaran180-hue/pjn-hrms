import React, { useState } from 'react';
import {
  Calendar,
  Filter,
  TrendingUp,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';

interface DepartmentAttendance {
  department: string;
  totalStaff: number;
  presentRate: number;
  lateRate: number;
  avgHours: string;
}

const deptStats: DepartmentAttendance[] = [
  { department: 'Engineering', totalStaff: 48, presentRate: 94.2, lateRate: 2.1, avgHours: '8h 52m' },
  { department: 'Mobile Apps', totalStaff: 22, presentRate: 96.0, lateRate: 1.5, avgHours: '9h 05m' },
  { department: 'Backend', totalStaff: 26, presentRate: 92.3, lateRate: 3.8, avgHours: '8h 40m' },
  { department: 'Quality Assurance', totalStaff: 18, presentRate: 91.5, lateRate: 2.2, avgHours: '8h 35m' },
  { department: 'Database', totalStaff: 12, presentRate: 95.0, lateRate: 0.0, avgHours: '9h 10m' },
  { department: 'Human Resources', totalStaff: 14, presentRate: 88.0, lateRate: 4.0, avgHours: '8h 15m' },
  { department: 'DevOps & Cloud', totalStaff: 14, presentRate: 97.2, lateRate: 1.0, avgHours: '9h 22m' }
];

export const ReportsAnalytics: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState('This Month (Nov 2026)');

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Attendance Reports & Workforce Analytics
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Turnout aggregates, departmental punctuality, and geofence compliance reporting
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<FileSpreadsheet size={15} />}
            onClick={() => alert('Downloading Attendance Report CSV...')}
          >
            Export CSV
          </Button>
          <Button
            size="sm"
            icon={<FileText size={15} />}
            onClick={() => alert('Generating PDF Executive Summary...')}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* 2. Range Filter Bar */}
      <Card padding="sm" className="flex flex-wrap items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-[#6338DF]" />
          <span className="text-xs font-semibold text-gray-700">Reporting Interval:</span>
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6338DF]"
          >
            <option>Today (16 Nov 2026)</option>
            <option>Current Week (16 - 22 Nov 2026)</option>
            <option>This Month (Nov 2026)</option>
            <option>Last Month (Oct 2026)</option>
            <option>Q4 FY26 (Oct - Dec 2026)</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Filter size={14} />
          <span>Showing all 3 operating branches • 154 active personnel</span>
        </div>
      </Card>

      {/* 3. High Level Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <p className="text-xs font-semibold text-gray-500 uppercase">Average Attendance</p>
          <h3 className="text-2xl font-extrabold text-[#161A3D] mt-1">93.4%</h3>
          <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp size={13} /> +1.8% vs last month
          </p>
        </Card>

        <Card>
          <p className="text-xs font-semibold text-gray-500 uppercase">On-Time Arrival Rate</p>
          <h3 className="text-2xl font-extrabold text-[#161A3D] mt-1">96.8%</h3>
          <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp size={13} /> High punctuality index
          </p>
        </Card>

        <Card>
          <p className="text-xs font-semibold text-gray-500 uppercase">Average Daily Hours</p>
          <h3 className="text-2xl font-extrabold text-[#161A3D] mt-1">8h 48m</h3>
          <p className="text-xs text-purple-600 font-medium mt-1">
            Target: 8h 30m standard
          </p>
        </Card>

        <Card>
          <p className="text-xs font-semibold text-gray-500 uppercase">Geofence Compliance</p>
          <h3 className="text-2xl font-extrabold text-[#161A3D] mt-1">99.1%</h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            100m radius check passed
          </p>
        </Card>
      </div>

      {/* 4. Department Performance Matrix */}
      <Card padding="none" className="overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">
              Department Attendance Breakdown
            </h3>
            <p className="text-xs text-gray-500">
              Comparative workforce presence across technical and operational business units
            </p>
          </div>
          <Badge variant="purple">Interval: {selectedRange}</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Department</th>
                <th className="py-3.5 px-4 sm:px-6">Headcount</th>
                <th className="py-3.5 px-4 sm:px-6">Turnout Rate</th>
                <th className="py-3.5 px-4 sm:px-6">Late Ratio</th>
                <th className="py-3.5 px-4 sm:px-6">Avg Daily Work Hours</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Performance Pill</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {deptStats.map((item) => (
                <tr key={item.department} className="hover:bg-purple-50/20 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-gray-900">
                    {item.department}
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-gray-600 font-medium">
                    {item.totalStaff} members
                  </td>

                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#6338DF] h-full rounded-full"
                          style={{ width: `${item.presentRate}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-700">{item.presentRate}%</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-xs text-gray-600">
                    <span className={item.lateRate > 3 ? 'text-amber-600 font-semibold' : 'text-gray-600'}>
                      {item.lateRate}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-xs font-medium text-gray-800">
                    {item.avgHours}
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <Badge variant={item.presentRate >= 93 ? 'present' : 'pending'}>
                      {item.presentRate >= 93 ? 'Optimal' : 'Needs Review'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
