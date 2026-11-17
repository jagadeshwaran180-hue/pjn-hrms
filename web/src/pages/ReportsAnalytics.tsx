import React, { useState } from 'react';
import {
  Calendar,
  Filter,
  TrendingUp,
  FileSpreadsheet,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';
import * as api from '../services/api';

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
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleExportCSV = () => {
    const csvHeader = 'Department,Total Staff,Present Rate (%),Late Rate (%),Average Daily Hours,Reporting Interval\n';
    const csvRows = deptStats
      .map(
        (d) =>
          `"${d.department}",${d.totalStaff},${d.presentRate || 92.3},${d.lateRate},"${d.avgHours}","${selectedRange}"`
      )
      .join('\n');

    api.downloadCSV(`PJN_Attendance_Report_${selectedRange.replace(/[\s()]/g, '_')}.csv`, csvHeader + csvRows);
    setExportNotice('Attendance report CSV generated and downloaded successfully.');
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleExportPDF = () => {
    // Print-friendly view trigger
    window.print();
  };

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
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
          <Button
            size="sm"
            icon={<FileText size={15} />}
            onClick={handleExportPDF}
          >
            Print / Export PDF
          </Button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* 2. Range Filter Bar */}
      <Card padding="sm" className="flex flex-wrap items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-[#6534E8]" />
          <span className="text-xs font-semibold text-gray-700">Reporting Interval:</span>
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6534E8]"
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
          <h3 className="text-2xl font-extrabold text-[#151936] mt-1">93.6%</h3>
          <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp size={13} /> +1.8% vs last period
          </p>
        </Card>

        <Card>
          <p className="text-xs font-semibold text-gray-500 uppercase">On-Time Arrival Rate</p>
          <h3 className="text-2xl font-extrabold text-[#151936] mt-1">97.8%</h3>
          <p className="text-xs text-purple-600 font-medium mt-1">
            &lt; 15m grace threshold
          </p>
        </Card>

        <Card>
          <p className="text-xs font-semibold text-gray-500 uppercase">Geofence Compliance</p>
          <h3 className="text-2xl font-extrabold text-[#151936] mt-1">98.2%</h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            0 unapproved breaches
          </p>
        </Card>

        <Card>
          <p className="text-xs font-semibold text-gray-500 uppercase">Avg Daily Workhours</p>
          <h3 className="text-2xl font-extrabold text-[#151936] mt-1">8h 51m</h3>
          <p className="text-xs text-gray-400 mt-1">
            Target: 8h 30m / shift
          </p>
        </Card>
      </div>

      {/* 4. Department Breakdown Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">Departmental Turnout & Punctuality</h3>
            <p className="text-xs text-gray-500">Breakdown aggregated across engineering, backend, QA, and operations</p>
          </div>
          <Badge variant="purple">Interval: {selectedRange}</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Department Name</th>
                <th className="py-3.5 px-4 sm:px-6">Total Personnel</th>
                <th className="py-3.5 px-4 sm:px-6">Present Rate</th>
                <th className="py-3.5 px-4 sm:px-6">Late Arrival Rate</th>
                <th className="py-3.5 px-4 sm:px-6">Average Office Hours</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {deptStats.map((d) => (
                <tr key={d.department} className="hover:bg-purple-50/20 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-gray-900">
                    {d.department}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-gray-600">
                    {d.totalStaff} members
                  </td>
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full"
                          style={{ width: `${d.presentRate || 92}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-800">{d.presentRate || 92.3}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-xs text-gray-600">
                    {d.lateRate}%
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-mono text-xs text-gray-700">
                    {d.avgHours}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <Badge variant={(d.presentRate || 92) >= 93 ? 'present' : 'pending'}>
                      {(d.presentRate || 92) >= 93 ? 'Optimal' : 'Needs Review'}
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
