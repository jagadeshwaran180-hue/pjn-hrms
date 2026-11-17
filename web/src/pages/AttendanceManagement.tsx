import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Laptop,
  Filter,
  Search,
  Download,
  Navigation
} from 'lucide-react';
import { Card, Badge, Button, Input } from '../components/ui';
import { useAuth } from '../context/AuthContext';

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
  },
  {
    id: 'ATT-010',
    empId: 'EMP-010',
    name: 'Amrutha K',
    department: 'Quality Assurance',
    branch: 'BLR-HQ',
    checkIn: '09:18 AM',
    checkOut: '--:--',
    workHours: '06h 37m (In Progress)',
    locationStatus: 'Inside Geofence',
    status: 'Present',
    distanceMeters: 15
  }
];

export const AttendanceManagement: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Self-service GPS punch simulation state
  const [punchStatus, setPunchStatus] = useState<{ checkedIn: boolean; time: string; distance: number }>({
    checkedIn: true,
    time: '09:02 AM',
    distance: 14
  });
  const [punchFeedback, setPunchFeedback] = useState<string | null>(null);

  const isEmployee = user?.role === 'EMPLOYEE';
  const isManager = user?.role === 'MANAGER';
  const isAdminOrHr = user?.role === 'ADMIN' || user?.role === 'HR';

  // Handle GPS check-in/out for the employee themselves
  const handleTogglePunch = () => {
    if (punchStatus.checkedIn) {
      setPunchStatus({ checkedIn: false, time: '06:15 PM', distance: 18 });
      setPunchFeedback(`GPS Check-Out logged successfully at 06:15 PM (18m from BLR-HQ geofence center).`);
    } else {
      setPunchStatus({ checkedIn: true, time: '09:05 AM', distance: 22 });
      setPunchFeedback(`GPS Check-In logged successfully at 09:05 AM (22m within BLR-HQ geofence radius).`);
    }
    setTimeout(() => setPunchFeedback(null), 4000);
  };

  // Restrict records strictly by role and record ownership
  const authorizedLogs = useMemo(() => {
    return mockAttendanceLogs.filter((log) => {
      // 1. Employee: only their own records
      if (isEmployee) {
        return log.empId === user?.id;
      }
      // 2. Manager: their own records + records of their assigned team members
      if (isManager) {
        return log.empId === user?.id || (user?.managedTeam && user.managedTeam.includes(log.empId));
      }
      // 3. Admin & HR: all records
      return true;
    });
  }, [isEmployee, isManager, user]);

  const filteredLogs = useMemo(() => {
    return authorizedLogs.filter((log) => {
      const matchSearch =
        log.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchBranch = branchFilter === 'All' || log.branch === branchFilter;
      const matchStatus = statusFilter === 'All' || log.status === statusFilter;
      return matchSearch && matchBranch && matchStatus;
    });
  }, [authorizedLogs, searchTerm, branchFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              {isEmployee ? 'My GPS Attendance & Punches' : 'Attendance Dashboard & Geofence Logs'}
            </h2>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              user?.role === 'ADMIN' ? 'bg-purple-100 text-[#6338DF]' :
              user?.role === 'HR' ? 'bg-blue-100 text-blue-700' :
              user?.role === 'MANAGER' ? 'bg-amber-100 text-amber-700' :
              'bg-emerald-100 text-emerald-700'
            }`}>
              {user?.role} VIEW
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {isEmployee && 'Mark your daily attendance and monitor your verified GPS geofence timestamps.'}
            {isManager && 'Monitor daily check-in accuracy and geofence compliance for your assigned team.'}
            {isAdminOrHr && 'Real-time GPS in-house check-in verification and remote attendance records.'}
          </p>
        </div>

        {isAdminOrHr && (
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
        )}
      </div>

      {/* Self-service GPS Punch Widget for Employees & Managers */}
      <Card className="bg-gradient-to-r from-purple-50/50 to-indigo-50/50 border border-purple-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              punchStatus.checkedIn ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
            }`}>
              <Navigation size={22} className={punchStatus.checkedIn ? 'animate-pulse' : ''} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                  GPS Mobile Attendance Punch
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  BLR-HQ Geofence Active (100m)
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                Current status: <span className="font-semibold text-gray-900">{punchStatus.checkedIn ? 'Checked In' : 'Checked Out'}</span> at {punchStatus.time} ({punchStatus.distance}m from office center)
              </p>
            </div>
          </div>

          <Button
            variant={punchStatus.checkedIn ? 'outline' : 'primary'}
            onClick={handleTogglePunch}
            icon={punchStatus.checkedIn ? <Clock size={16} /> : <CheckCircle2 size={16} />}
          >
            {punchStatus.checkedIn ? 'Punch Check-Out' : 'Punch Check-In'}
          </Button>
        </div>

        {punchFeedback && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-100/70 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={15} className="text-emerald-700" />
            <span>{punchFeedback}</span>
          </div>
        )}
      </Card>

      {/* 2. Geofence & Attendance KPI Summary (Manager & Admin/HR only) */}
      {!isEmployee && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Present On-Site</p>
              <h3 className="text-2xl font-extrabold text-[#161A3D] mt-1">
                {isManager ? authorizedLogs.filter((l) => l.status === 'Present').length : 134}
              </h3>
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
              <h3 className="text-2xl font-extrabold text-[#161A3D] mt-1">
                {isManager ? authorizedLogs.filter((l) => l.locationStatus === 'Hybrid Approved').length : 12}
              </h3>
              <p className="text-xs text-purple-600 font-medium mt-0.5 flex items-center gap-1">
                <Laptop size={13} /> Authorized remote
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-[#6338DF] flex items-center justify-center">
              <Laptop size={20} />
            </div>
          </Card>

          <Card className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Late Arrivals</p>
              <h3 className="text-2xl font-extrabold text-[#161A3D] mt-1">
                {isManager ? authorizedLogs.filter((l) => l.status === 'Late').length : 4}
              </h3>
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
      )}

      {/* 3. Search & Filters Bar */}
      <Card padding="sm" className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex-1">
          <Input
            icon={<Search size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isEmployee ? 'Search your punch notes...' : 'Search by employee name, ID, or department...'}
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
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">
              {isEmployee ? 'My Attendance Punch Log' : isManager ? 'Assigned Team Attendance Logs' : 'All Enterprise Attendance Logs'}
            </h3>
            <p className="text-xs text-gray-500">
              {isEmployee
                ? 'Showing only your personal authenticated GPS punches.'
                : isManager
                ? 'Showing records for you and your assigned team members.'
                : 'All employee GPS punches and remote check-ins across branches.'}
            </p>
          </div>
          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 font-mono">
            {filteredLogs.length} records
          </span>
        </div>

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
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-gray-400">
                    No attendance logs found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isOwnRecord = log.empId === user?.id;

                  return (
                    <tr key={log.id} className="hover:bg-purple-50/20 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-gray-900">{log.name}</p>
                          {isOwnRecord && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-[#6338DF]">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono text-[#6338DF]">{log.empId} â€¢ {log.department}</p>
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
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          log.locationStatus === 'Inside Geofence'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : log.locationStatus === 'Hybrid Approved'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {log.locationStatus === 'Inside Geofence' ? (
                            <CheckCircle2 size={12} />
                          ) : log.locationStatus === 'Hybrid Approved' ? (
                            <Laptop size={12} />
                          ) : (
                            <XCircle size={12} />
                          )}
                          {log.locationStatus} ({log.distanceMeters}m)
                        </span>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6">
                        <Badge
                          variant={
                            log.status === 'Present'
                              ? 'present'
                              : log.status === 'Late'
                              ? 'late'
                              : 'absent'
                          }
                        >
                          {log.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
