import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  Filter,
  FileSpreadsheet,
  Clock,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { Card, Badge, Button, Input } from '../components/ui';
import { useRefresh } from '../context/RefreshContext';
import * as api from '../services/api';

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

export const AuditLogs: React.FC = () => {
  const { registerRefreshHandler } = useRefresh();

  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const loadAuditLogs = useCallback(async () => {
    try {
      setFetchError(null);
      const data = await api.getAuditLogs();
      setLogs(data);
    } catch (err: any) {
      console.error('Failed to load audit logs:', err);
      setFetchError(err.message || 'Unable to retrieve system audit logs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAuditLogs();
  }, [loadAuditLogs]);

  useEffect(() => {
    return registerRefreshHandler(async () => {
      await loadAuditLogs();
    });
  }, [registerRefreshHandler, loadAuditLogs]);

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      alert('No audit log entries to export.');
      return;
    }

    const header = 'ID,Timestamp,Actor,Role,Action,Target,IP Address,Status\n';
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.actor}","${l.role}","${l.action}","${l.target}","${l.ipAddress}","${l.status}"`
      )
      .join('\n');

    api.downloadCSV(`PJN_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`, header + rows);
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch =
        log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'All' || log.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [logs, searchTerm, statusFilter]);

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
          onClick={handleExportCSV}
        >
          Export Audit Trail CSV
        </Button>
      </div>

      {fetchError && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-600 shrink-0" />
            <span>{fetchError}</span>
          </div>
          <Button size="sm" variant="outline" onClick={loadAuditLogs}>
            Retry
          </Button>
        </div>
      )}

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
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6534E8]"
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
                <th className="py-3.5 px-4 sm:px-6 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-gray-400">
                    <Loader2 size={24} className="animate-spin mx-auto text-[#6534E8] mb-2" />
                    Loading audit trail entries...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-gray-400">
                    No audit records found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <p className="font-mono text-xs font-bold text-[#6534E8]">{log.id}</p>
                      <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock size={11} /> {log.timestamp}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 sm:px-6">
                      <p className="font-semibold text-gray-800 text-xs">{log.actor}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-mono">
                        {log.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-xs font-medium text-gray-900">
                      {log.action}
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-xs text-gray-600 max-w-xs truncate" title={log.target}>
                      {log.target}
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 font-mono text-xs text-gray-500">
                      {log.ipAddress}
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <Badge
                        variant={
                          log.status === 'SUCCESS'
                            ? 'present'
                            : log.status === 'WARNING'
                            ? 'pending'
                            : 'absent'
                        }
                      >
                        {log.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
