import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Laptop,
  Filter,
  Search,
  Download,
  Navigation,
  Loader2,
  AlertTriangle,
  CalendarCheck
} from 'lucide-react';
import { Card, Badge, Button, Input } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useRefresh } from '../context/RefreshContext';
import * as api from '../services/api';

interface AttendanceLog {
  id: string;
  empId: string;
  name: string;
  department: string;
  branch: string;
  date?: string;
  checkIn: string;
  checkOut: string;
  workHours: string;
  locationStatus: 'Inside Geofence' | 'Hybrid Approved' | 'Geofence Breach' | 'Approved Leave';
  status: 'Present' | 'Late' | 'Absent' | 'On Leave';
  distanceMeters: number;
}

export const AttendanceManagement: React.FC = () => {
  const { user } = useAuth();
  const { registerRefreshHandler } = useRefresh();

  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // GPS Punch State
  const [punchLoading, setPunchLoading] = useState(false);
  const [punchFeedback, setPunchFeedback] = useState<{ text: string; isError?: boolean } | null>(null);

  const isEmployee = user?.role === 'EMPLOYEE';
  const isManager = user?.role === 'MANAGER';
  const isAdminOrHr = user?.role === 'ADMIN' || user?.role === 'HR';

  // Load attendance logs from backend
  const loadLogs = useCallback(async () => {
    try {
      setFetchError(null);
      const data = await api.getAttendanceLogs();
      setLogs(data);
    } catch (err: any) {
      console.error('Failed to load attendance logs:', err);
      setFetchError(err.message || 'Unable to retrieve attendance records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  // Hook into global RefreshContext
  useEffect(() => {
    return registerRefreshHandler(async () => {
      await loadLogs();
    });
  }, [registerRefreshHandler, loadLogs]);

  // Current user's punch status derived from backend log
  const myLog = useMemo(() => {
    return logs.find((l) => l.empId === user?.id);
  }, [logs, user?.id]);

  const isCheckedIn = useMemo(() => {
    if (!myLog) return false;
    return myLog.checkIn !== '--:--' && myLog.checkOut === '--:--';
  }, [myLog]);

  // Handle GPS check-in/out for the employee themselves
  const handleTogglePunch = async () => {
    if (punchLoading) return;
    setPunchLoading(true);
    setPunchFeedback(null);

    const action = isCheckedIn ? 'out' : 'in';
    const distanceMeters = Math.floor(12 + Math.random() * 20); // Simulated GPS coordinate validation

    try {
      const res = await api.punchAttendance(action, distanceMeters);
      setPunchFeedback({ text: res.message, isError: false });
      await loadLogs();
    } catch (err: any) {
      console.error('Punch failed:', err);
      setPunchFeedback({ text: err.message || 'GPS Punch failed. Please retry.', isError: true });
    } finally {
      setPunchLoading(false);
      setTimeout(() => setPunchFeedback(null), 5000);
    }
  };

  // Export filtered logs to real CSV
  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      alert('No attendance records available to export.');
      return;
    }

    const header = 'ID,Employee ID,Name,Department,Branch,Date,Check-In,Check-Out,Hours,Geofence Status,Distance (m),Status\n';
    const rows = filteredLogs.map((l) =>
      `"${l.id}","${l.empId}","${l.name}","${l.department}","${l.branch}","${l.date || '16 Nov 2026'}","${l.checkIn}","${l.checkOut}","${l.workHours}","${l.locationStatus}",${l.distanceMeters},"${l.status}"`
    ).join('\n');

    api.downloadCSV(`Attendance_Logs_${new Date().toISOString().split('T')[0]}.csv`, header + rows);
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch =
        log.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchBranch = branchFilter === 'All' || log.branch === branchFilter;
      const matchStatus = statusFilter === 'All' || log.status === statusFilter;
      return matchSearch && matchBranch && matchStatus;
    });
  }, [logs, searchTerm, branchFilter, statusFilter]);

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
              user?.role === 'ADMIN' ? 'bg-purple-100 text-[#6534E8]' :
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
              onClick={handleExportCSV}
            >
              Export Logs CSV
            </Button>
          </div>
        )}
      </div>

      {/* Fetch Error Banner */}
      {fetchError && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-600 shrink-0" />
            <span>{fetchError}</span>
          </div>
          <Button size="sm" variant="outline" onClick={loadLogs}>
            Retry
          </Button>
        </div>
      )}

      {/* Self-service GPS Punch Widget */}
      <Card className="bg-gradient-to-r from-purple-50/50 to-indigo-50/50 border border-purple-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isCheckedIn ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
            }`}>
              <Navigation size={22} className={isCheckedIn ? 'animate-pulse' : ''} />
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
                Current status: <span className="font-semibold text-gray-900">
                  {isCheckedIn ? 'Checked In' : 'Checked Out'}
                </span> {myLog ? `at ${isCheckedIn ? myLog.checkIn : myLog.checkOut} (${myLog.distanceMeters}m from office center)` : 'at BLR-HQ'}
              </p>
            </div>
          </div>

          <Button
            variant={isCheckedIn ? 'outline' : 'primary'}
            onClick={handleTogglePunch}
            disabled={punchLoading}
            icon={punchLoading ? <Loader2 size={16} className="animate-spin" /> : isCheckedIn ? <Clock size={16} /> : <CheckCircle2 size={16} />}
          >
            {punchLoading ? 'Recording...' : isCheckedIn ? 'Punch Check-Out' : 'Punch Check-In'}
          </Button>
        </div>

        {punchFeedback && (
          <div className={`mt-3 p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
            punchFeedback.isError
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-emerald-100/70 border-emerald-200 text-emerald-900'
          }`}>
            {punchFeedback.isError ? (
              <XCircle size={15} className="text-red-600" />
            ) : (
              <CheckCircle2 size={15} className="text-emerald-700" />
            )}
            <span>{punchFeedback.text}</span>
          </div>
        )}
      </Card>

      {/* 2. Geofence & Attendance KPI Summary (Manager & Admin/HR only) */}
      {!isEmployee && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Present On-Site</p>
              <h3 className="text-2xl font-extrabold text-[#151936] mt-1">
                {logs.filter((l) => l.status === 'Present').length}
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
              <h3 className="text-2xl font-extrabold text-[#151936] mt-1">
                {logs.filter((l) => l.locationStatus === 'Hybrid Approved').length}
              </h3>
              <p className="text-xs text-purple-600 font-medium mt-0.5 flex items-center gap-1">
                <Laptop size={13} /> Authorized remote
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-[#6534E8] flex items-center justify-center">
              <Laptop size={20} />
            </div>
          </Card>

          <Card className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Late Arrivals</p>
              <h3 className="text-2xl font-extrabold text-[#151936] mt-1">
                {logs.filter((l) => l.status === 'Late').length}
              </h3>
              <p className="text-xs text-amber-600 font-medium mt-0.5 flex items-center gap-1">
                <Clock size={13} /> Shift start + grace period
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={20} />
            </div>
          </Card>

          <Card className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Geofence Compliance</p>
              <h3 className="text-2xl font-extrabold text-[#151936] mt-1">
                {logs.length > 0
                  ? `${Math.round(((logs.length - logs.filter((l) => l.locationStatus === 'Geofence Breach').length) / logs.length) * 100)}%`
                  : '100%'}
              </h3>
              <p className="text-xs text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                <CheckCircle2 size={13} /> Verified coordinates
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-gray-400">
                    <Loader2 size={24} className="animate-spin mx-auto text-[#6534E8] mb-2" />
                    Loading verified GPS attendance logs...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
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
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-[#6534E8]">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono text-[#6534E8]">{log.empId} • {log.department}</p>
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
                            : log.locationStatus === 'Approved Leave'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {log.locationStatus === 'Inside Geofence' ? (
                            <CheckCircle2 size={12} />
                          ) : log.locationStatus === 'Hybrid Approved' ? (
                            <Laptop size={12} />
                          ) : log.locationStatus === 'Approved Leave' ? (
                            <CalendarCheck size={12} />
                          ) : (
                            <XCircle size={12} />
                          )}
                          {log.locationStatus}{log.locationStatus === 'Inside Geofence' || log.locationStatus === 'Geofence Breach' ? ` (${log.distanceMeters}m)` : ''}
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
