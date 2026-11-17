import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Clock
} from 'lucide-react';
import { Card, Badge, Button, Input } from '../components/ui';

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

const mockAuditLogs: AuditEntry[] = [
  {
    id: 'AUD-901',
    timestamp: '16 Nov 2026, 03:45 PM',
    actor: 'admin@pjntech.com',
    role: 'ADMIN',
    action: 'Approved Hybrid Work Authorization',
    target: 'Request #HYB-202 (Ayesha N)',
    ipAddress: '106.51.78.12',
    status: 'SUCCESS'
  },
  {
    id: 'AUD-902',
    timestamp: '16 Nov 2026, 02:30 PM',
    actor: 'admin@pjntech.com',
    role: 'ADMIN',
    action: 'Updated Branch Geofence Radius',
    target: 'Branch BLR-HQ (100m validated)',
    ipAddress: '106.51.78.12',
    status: 'SUCCESS'
  },
  {
    id: 'AUD-903',
    timestamp: '16 Nov 2026, 01:15 PM',
    actor: 'jagadeesh@pjntech.com',
    role: 'EMPLOYEE',
    action: 'In-House Attendance Check-In',
    target: 'Branch BLR-HQ (24m inside radius)',
    ipAddress: '192.168.1.45',
    status: 'SUCCESS'
  },
  {
    id: 'AUD-904',
    timestamp: '16 Nov 2026, 11:20 AM',
    actor: 'rahul@pjntech.com',
    role: 'EMPLOYEE',
    action: 'Geofence Perimeter Warning',
    target: 'Check-in attempted 120m from office',
    ipAddress: '49.207.210.88',
    status: 'WARNING'
  },
  {
    id: 'AUD-905',
    timestamp: '16 Nov 2026, 09:40 AM',
    actor: 'guest_ip_blocked',
    role: 'UNKNOWN',
    action: 'Failed Login Attempt (Invalid Password)',
    target: 'Account: hr_lead@pjntech.com',
    ipAddress: '185.220.101.5',
    status: 'FAILED'
  },
  {
    id: 'AUD-906',
    timestamp: '15 Nov 2026, 05:10 PM',
    actor: 'admin@pjntech.com',
    role: 'ADMIN',
    action: 'Revoked Hybrid Attendance',
    target: 'Request #HYB-204 (Rahul M)',
    ipAddress: '106.51.78.12',
    status: 'SUCCESS'
  }
];

export const AuditLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredLogs = useMemo(() => {
    return mockAuditLogs.filter((log) => {
      const matchSearch =
        log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'All' || log.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Security & System Audit Logs
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Immutable log of all authorization decisions, geofence checks, and administrative changes
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<FileSpreadsheet size={15} />}
          onClick={() => alert('Exporting audit log trail...')}
        >
          Export Audit Trail
        </Button>
      </div>

      {/* 2. Filter Bar */}
      <Card padding="sm" className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex-1">
          <Input
            icon={<Search size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by actor, action description, or target..."
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700"
          >
            <option value="All">All Event Outcomes</option>
            <option value="SUCCESS">Success Only</option>
            <option value="WARNING">Warnings / Perimeter</option>
            <option value="FAILED">Failed / Denied</option>
          </select>
        </div>
      </Card>

      {/* 3. Audit Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Log ID & Time</th>
                <th className="py-3.5 px-4 sm:px-6">Actor</th>
                <th className="py-3.5 px-4 sm:px-6">Action Performed</th>
                <th className="py-3.5 px-4 sm:px-6">Target Resource</th>
                <th className="py-3.5 px-4 sm:px-6">IP Address</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map((entry) => (
                <tr key={entry.id} className="hover:bg-purple-50/20 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6">
                    <p className="font-mono text-xs font-bold text-[#6338DF]">{entry.id}</p>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <Clock size={11} /> {entry.timestamp}
                    </p>
                  </td>

                  <td className="py-3.5 px-4 sm:px-6">
                    <p className="font-semibold text-gray-900 text-xs sm:text-sm">{entry.actor}</p>
                    <Badge variant="neutral" className="mt-0.5 text-[10px]">{entry.role}</Badge>
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 font-medium text-gray-800 text-xs sm:text-sm">
                    {entry.action}
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-xs text-gray-600 font-mono">
                    {entry.target}
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-xs text-gray-500 font-mono">
                    {entry.ipAddress}
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    {entry.status === 'SUCCESS' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={12} /> Success
                      </span>
                    )}
                    {entry.status === 'WARNING' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <ShieldAlert size={12} /> Warning
                      </span>
                    )}
                    {entry.status === 'FAILED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                        <XCircle size={12} /> Failed
                      </span>
                    )}
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
