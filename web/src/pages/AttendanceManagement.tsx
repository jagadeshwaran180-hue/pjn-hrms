import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Laptop,
  Filter,
  Search,
  Download
} from 'lucide-react';
import { Card, Badge, Button, Input } from '../components/ui';

interface AttendanceLog {
  id: string;
  empId: string;
  name: string;
  department: string;
  branch: string;
  checkIn: string;
  checkOut: string;
  workHours: string;
  locationStatus: 'Inside Geofence' | 'Hybrid Approved' | 'Geofence Breach';
  status: 'Present' | 'Late' | 'Absent' | 'On Leave';
  distanceMeters: number;
}

const mockAttendanceLogs: AttendanceLog[] = [
  {
    id: 'ATT-001',
    empId: 'EMP-001',
    name: 'Jagadeesh K',
    department: 'Engineering',
    branch: 'BLR-HQ',
    checkIn: '09:15 AM',
    checkOut: '06:20 PM',
    workHours: '09h 05m',
    locationStatus: 'Inside Geofence',
    status: 'Present',
    distanceMeters: 24
  },
  {
    id: 'ATT-002',
    empId: 'EMP-002',
    name: 'Imran M',
    department: 'Engineering',
    branch: 'BLR-HQ',
    checkIn: '09:10 AM',
    checkOut: '--:--',
    workHours: '06h 45m (In Progress)',
    locationStatus: 'Inside Geofence',
    status: 'Present',
    distanceMeters: 12
  },
  {
    id: 'ATT-003',
    empId: 'EMP-003',
    name: 'Karthick R',
    department: 'Mobile Apps',
    branch: 'MAA-01',
    checkIn: '09:20 AM',
    checkOut: '--:--',
    workHours: '06h 35m (In Progress)',
    locationStatus: 'Inside Geofence',
    status: 'Present',
    distanceMeters: 45
  },
  {
    id: 'ATT-004',
    empId: 'EMP-004',
    name: 'Ayesha N',
    department: 'Backend',
    branch: 'BLR-HQ',
    checkIn: '09:48 AM',
    checkOut: '--:--',
    workHours: '06h 07m (In Progress)',
    locationStatus: 'Inside Geofence',
    status: 'Late',
    distanceMeters: 68
  },
  {
    id: 'ATT-005',
    empId: 'EMP-005',
    name: 'Arun Kumar',
    department: 'Human Resources',
    branch: 'BLR-HQ',
    checkIn: '--:--',
    checkOut: '--:--',
    workHours: '00h 00m',
    locationStatus: 'Hybrid Approved',
    status: 'On Leave',
    distanceMeters: 0
  },
  {
    id: 'ATT-006',
    empId: 'EMP-006',
    name: 'Priya S',
    department: 'Quality Assurance',
    branch: 'HYD-01',
    checkIn: '09:25 AM',
    checkOut: '--:--',
    workHours: '06h 30m (In Progress)',
    locationStatus: 'Hybrid Approved',
    status: 'Present',
    distanceMeters: 0
  },
  {
    id: 'ATT-007',
    empId: 'EMP-007',
    name: 'Rahul M',
    department: 'DevOps & Cloud',
    branch: 'BLR-HQ',
    checkIn: '09:55 AM',
    checkOut: '--:--',
    workHours: '06h 00m (In Progress)',
    locationStatus: 'Inside Geofence',
    status: 'Late',
    distanceMeters: 82
  },
  {
    id: 'ATT-008',
    empId: 'EMP-008',
    name: 'Trupthi V',
    department: 'Database',
    branch: 'MAA-01',
    checkIn: '09:12 AM',
    checkOut: '--:--',
    workHours: '06h 43m (In Progress)',
    locationStatus: 'Inside Geofence',
    status: 'Present',
    distanceMeters: 18
  }
];

export const AttendanceManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredLogs = useMemo(() => {
    return mockAttendanceLogs.filter((log) => {
      const matchSearch =
        log.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchBranch = branchFilter === 'All' || log.branch === branchFilter;
      const matchStatus = statusFilter === 'All' || log.status === statusFilter;
      return matchSearch && matchBranch && matchStatus;
    });
  }, [searchTerm, branchFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Attendance Dashboard & Geofence Logs
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Real-time GPS in-house check-in verification and remote attendance records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Download size={15} />}
            onClick={() => alert('Exporting attendance records to CSV...')}
          >
            Export Logs
          </Button>
        </div>
      </div>

      {/* 2. Geofence & Attendance KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Present On-Site</p>
            <h3 className="text-2xl font-extrabold text-[#161A3D] mt-1">134</h3>
            <p className="text-xs text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
              <CheckCircle2 size={13} /> Verified in 100m radius
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MapPin size={20} />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Hybrid Approved</p>
            <h3 className="text-2xl font-extrabold text-[#161A3D] mt-1">12</h3>
            <p className="text-xs text-purple-600 font-medium mt-0.5 flex items-center gap-1">
              <Laptop size={13} /> HR Authorized remote
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-[#6338DF] flex items-center justify-center">
            <Laptop size={20} />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Late Arrivals</p>
            <h3 className="text-2xl font-extrabold text-[#161A3D] mt-1">4</h3>
            <p className="text-xs text-amber-600 font-medium mt-0.5 flex items-center gap-1">
              <Clock size={13} /> After 09:30 AM cutoff
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Geofence Compliance</p>
            <h3 className="text-2xl font-extrabold text-[#161A3D] mt-1">98.4%</h3>
            <p className="text-xs text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
              <CheckCircle2 size={13} /> 0 unapproved breaches
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </Card>
      </div>

      {/* 3. Search & Filters Bar */}
      <Card padding="sm" className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex-1">
          <Input
            icon={<Search size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by employee name, ID, or department..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 text-xs font-semibold text-gray-500">
            <Filter size={13} />
            <span>Filters:</span>
          </div>

          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700"
          >
            <option value="All">All Branches</option>
            <option value="BLR-HQ">BLR-HQ (Bangalore)</option>
            <option value="MAA-01">MAA-01 (Chennai)</option>
            <option value="HYD-01">HYD-01 (Hyderabad)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700"
          >
            <option value="All">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
      </Card>

      {/* 4. Live Attendance Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Employee</th>
                <th className="py-3.5 px-4 sm:px-6">Branch</th>
                <th className="py-3.5 px-4 sm:px-6">Check In</th>
                <th className="py-3.5 px-4 sm:px-6">Check Out</th>
                <th className="py-3.5 px-4 sm:px-6">Hours</th>
                <th className="py-3.5 px-4 sm:px-6">GPS Geofence Status</th>
                <th className="py-3.5 px-4 sm:px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-purple-50/20 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6">
                    <div>
                      <p className="font-semibold text-gray-900">{log.name}</p>
                      <p className="text-xs font-mono text-[#6338DF]">{log.empId} • {log.department}</p>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 font-medium text-gray-700">
                    {log.branch}
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-gray-800">
                    {log.checkIn}
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-gray-500">
                    {log.checkOut}
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-xs text-gray-600">
                    {log.workHours}
                  </td>

                  <td className="py-3.5 px-4 sm:px-6">
                    {log.locationStatus === 'Inside Geofence' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={12} />
                        Inside (±{log.distanceMeters}m)
                      </span>
                    )}
                    {log.locationStatus === 'Hybrid Approved' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-[#6338DF] border border-purple-100">
                        <Laptop size={12} />
                        Hybrid Authorized
                      </span>
                    )}
                    {log.locationStatus === 'Geofence Breach' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                        <XCircle size={12} />
                        Out of Range
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 sm:px-6">
                    <Badge
                      variant={
                        log.status === 'Present'
                          ? 'present'
                          : log.status === 'Late'
                          ? 'pending'
                          : 'neutral'
                      }
                    >
                      {log.status}
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
