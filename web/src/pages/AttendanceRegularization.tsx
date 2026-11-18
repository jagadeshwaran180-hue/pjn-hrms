import React, { useState, useEffect, useCallback } from 'react';
import {
  FileCheck2,
  Plus,
  Clock,
  CheckCircle2,
  Check,
  X,
  ShieldAlert,
  Lock,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { Card, Badge, Button, Input, Modal } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useRefresh } from '../context/RefreshContext';
import * as api from '../services/api';

interface RegularizationRequest {
  id: string;
  empId: string;
  name: string;
  department: string;
  date: string;
  originalPunch: string;
  requestedPunch: string;
  type: 'Missed Check-In' | 'Missed Check-Out' | 'GPS Timeout / Device Glitch' | 'On-Duty Client Visit';
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedOn: string;
  processedBy?: string;
  processedAt?: string;
  version: number;
}

const formatTimestamp = (ts?: string) => {
  if (!ts) return '';
  const d = new Date(ts);
  if (isNaN(d.getTime())) return ts;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' +
         d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

export const AttendanceRegularization: React.FC = () => {
  const { user, canApprove } = useAuth();
  const { registerRefreshHandler } = useRefresh();

  const [requests, setRequests] = useState<RegularizationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isEmployee = user?.role === 'EMPLOYEE';
  const isManager = user?.role === 'MANAGER';
  const isAdminOrHr = user?.role === 'ADMIN' || user?.role === 'HR';

  const [form, setForm] = useState({
    date: '16 Nov 2026',
    originalPunch: 'Check-In: 09:15 AM | Check-Out: --:--',
    requestedPunch: '',
    type: 'Missed Check-Out' as RegularizationRequest['type'],
    reason: ''
  });

  const handleOpenModal = async () => {
    setFormError(null);
    let original = 'Check-In: 09:15 AM | Check-Out: --:--';
    try {
      const logs = await api.getAttendanceLogs();
      const myLog = logs.find((l: any) => l.empId === user?.id && (l.date === form.date || l.date === '16 Nov 2026'));
      if (myLog) {
        original = `Check-In: ${myLog.checkIn || '--:--'} | Check-Out: ${myLog.checkOut || '--:--'}`;
      }
    } catch {}
    setForm((prev) => ({
      ...prev,
      originalPunch: original,
      requestedPunch: '',
      reason: ''
    }));
    setIsModalOpen(true);
  };

  // Fetch from backend
  const loadRequests = useCallback(async () => {
    try {
      setFetchError(null);
      const data = await api.getRegularizationRequests();
      setRequests(data);
    } catch (err: any) {
      console.error('Failed to load regularization requests:', err);
      setFetchError(err.message || 'Unable to load punch regularization requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  // Hook into global RefreshContext
  useEffect(() => {
    return registerRefreshHandler(async () => {
      await loadRequests();
    });
  }, [registerRefreshHandler, loadRequests]);

  const handleApprove = async (id: string, recordOwnerId: string, version: number) => {
    if (processingId) return;
    setActionError(null);

    if (!canApprove(recordOwnerId)) {
      if (user?.id === recordOwnerId) {
        setActionError('Policy Violation: Self-approval is strictly forbidden. Managers cannot approve their own requests.');
      } else {
        setActionError('Access Denied: You are not authorized to approve this request.');
      }
      return;
    }

    setProcessingId(id);
    try {
      const updated = await api.decideRegularizationRequest(id, 'Approved', undefined, version);
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated, status: 'Approved' } : r)));
    } catch (err: any) {
      console.error('Regularization approval failed:', err);
      setActionError(err.message || 'Approval decision could not be saved. Please retry.');
      if (err.latest) {
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...err.latest } : r)));
      }
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string, recordOwnerId: string, version: number) => {
    if (processingId) return;
    setActionError(null);

    if (!canApprove(recordOwnerId)) {
      if (user?.id === recordOwnerId) {
        setActionError('Policy Violation: Managers cannot take approval actions on their own requests.');
      } else {
        setActionError('Access Denied: You are not authorized to reject this request.');
      }
      return;
    }

    setProcessingId(id);
    try {
      const updated = await api.decideRegularizationRequest(
        id,
        'Rejected',
        'Regularization rejected per office security and badge scan records',
        version
      );
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated, status: 'Rejected' } : r)));
    } catch (err: any) {
      console.error('Regularization rejection failed:', err);
      setActionError(err.message || 'Rejection decision could not be saved. Please retry.');
      if (err.latest) {
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...err.latest } : r)));
      }
    } finally {
      setProcessingId(null);
    }
  };

  const handleSaveRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.date.trim()) {
      setFormError('Please select or specify the incident date.');
      return;
    }
    if (!form.requestedPunch.trim()) {
      setFormError('Please enter the requested correction punch time.');
      return;
    }
    if (!form.reason.trim()) {
      setFormError('Please provide a detailed explanation for this punch correction.');
      return;
    }

    setFormSubmitting(true);
    try {
      const newReq = await api.createRegularizationRequest({
        date: form.date.trim(),
        originalPunch: form.originalPunch.trim(),
        requestedPunch: form.requestedPunch.trim(),
        type: form.type,
        reason: form.reason.trim(),
      });

      setRequests((prev) => [newReq, ...prev]);
      setIsModalOpen(false);
      setForm({
        date: '16 Nov 2026',
        originalPunch: 'Check-In: 09:15 AM | Check-Out: --:--',
        requestedPunch: 'Check-Out: 06:15 PM',
        type: 'Missed Check-Out',
        reason: ''
      });
    } catch (err: any) {
      console.error('Create regularization error:', err);
      setFormError(err.message || 'Failed to submit regularization request. Please retry.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const approvedCount = requests.filter((r) => r.status === 'Approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'Rejected').length;

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Attendance Regularization & Punch Corrections
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
            {isEmployee && 'Resolve missed punches, device location timeouts, and on-duty customer visits.'}
            {isManager && 'Review and regularize punch discrepancies for your assigned team members.'}
            {isAdminOrHr && 'Full organizational punch discrepancy management and audit alignment.'}
          </p>
        </div>

        <Button onClick={handleOpenModal} icon={<Plus size={16} />}>
          Request Regularization
        </Button>
      </div>

      {/* Action Error Notification */}
      {actionError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="shrink-0 text-red-600" />
            <span className="font-semibold">{actionError}</span>
          </div>
          <button
            onClick={() => setActionError(null)}
            className="text-red-500 hover:text-red-700 font-bold p-1"
          >
            ×
          </button>
        </div>
      )}

      {/* Fetch Error Notification */}
      {fetchError && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-600 shrink-0" />
            <span>{fetchError}</span>
          </div>
          <Button size="sm" variant="outline" onClick={loadRequests}>
            Retry
          </Button>
        </div>
      )}

      {/* 2. KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center justify-between border-l-4 border-amber-400">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Pending Review</p>
            <h3 className="text-2xl font-extrabold text-[#151936] mt-1">{pendingCount}</h3>
            <p className="text-xs text-amber-600 font-medium mt-0.5">
              {isEmployee ? 'Awaiting manager / HR verification' : 'Requires verification review'}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </Card>

        <Card className="flex items-center justify-between border-l-4 border-emerald-500">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Approved Adjustments</p>
            <h3 className="text-2xl font-extrabold text-[#151936] mt-1">{approvedCount}</h3>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">Punches updated in attendance ledger</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </Card>

        <Card className="flex items-center justify-between border-l-4 border-red-500">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Rejected Claims</p>
            <h3 className="text-2xl font-extrabold text-[#151936] mt-1">{rejectedCount}</h3>
            <p className="text-xs text-red-600 font-medium mt-0.5">Geofence breach confirmed</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <FileCheck2 size={20} />
          </div>
        </Card>
      </div>

      {/* 3. Requests Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                {isEmployee ? 'My Regularization Requests' : isManager ? 'Team Regularization Requests' : 'All Attendance Regularization Requests'}
              </h3>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 font-mono">
                {requests.length} records
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {isEmployee
                ? 'Track your submitted punch dispute resolutions.'
                : 'Review discrepancies and approve manual timestamp adjustments.'}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Request ID</th>
                <th className="py-3.5 px-4 sm:px-6">Employee</th>
                <th className="py-3.5 px-4 sm:px-6">Incident Date</th>
                <th className="py-3.5 px-4 sm:px-6">Punch Discrepancy</th>
                <th className="py-3.5 px-4 sm:px-6">Classification & Reason</th>
                <th className="py-3.5 px-4 sm:px-6">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-gray-400">
                    <Loader2 size={24} className="animate-spin mx-auto text-[#6534E8] mb-2" />
                    Loading regularization records...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-gray-400">
                    No regularization records found.
                  </td>
                </tr>
              ) : (
                requests.map((r) => {
                  const isOwnRecord = r.empId === user?.id;
                  const canTakeAction = canApprove(r.empId);
                  const isProcessingThis = processingId === r.id;

                  return (
                    <tr key={r.id} className="hover:bg-purple-50/20 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-mono text-xs font-bold text-[#6534E8]">
                        {r.id}
                      </td>

                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-gray-900">{r.name}</p>
                          {isOwnRecord && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-[#6534E8]">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 font-mono">{r.empId} • {r.department}</p>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-xs text-gray-700 font-medium">
                        {r.date}
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-xs">
                        <p className="text-gray-400">
                          {(() => {
                            const parts = r.originalPunch.split(' | ');
                            const req = r.requestedPunch.toLowerCase();
                            const correctsIn = req.includes('in:') || req.includes('check-in') || r.type === 'Missed Check-In';
                            const correctsOut = req.includes('out:') || req.includes('check-out') || r.type === 'Missed Check-Out';
                            let strikeIn = correctsIn;
                            let strikeOut = correctsOut;
                            if (!correctsIn && !correctsOut) {
                              strikeIn = true;
                              strikeOut = true;
                            }
                            return (
                              <>
                                <span className={strikeIn ? 'line-through' : ''}>{parts[0]}</span>
                                {parts[1] !== undefined && (
                                  <> | <span className={strikeOut ? 'line-through' : ''}>{parts[1]}</span></>
                                )}
                              </>
                            );
                          })()}
                        </p>
                        <p className="font-semibold text-emerald-600 mt-0.5">&rarr; {r.requestedPunch}</p>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-xs text-gray-700">
                        <p className="font-semibold text-gray-900">{r.type}</p>
                        <p className="text-gray-500 truncate max-w-xs" title={r.reason}>{r.reason}</p>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6">
                        <Badge
                          variant={
                            r.status === 'Approved'
                              ? 'present'
                              : r.status === 'Pending'
                              ? 'pending'
                              : 'absent'
                          }
                        >
                          {r.status}
                        </Badge>
                        {r.processedBy && (
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                            {r.status} by {r.processedBy}
                            {r.processedAt ? <><br />{formatTimestamp(r.processedAt)}</> : null}
                          </p>
                        )}
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        {/* EMPLOYEE: strictly no approve/reject buttons */}
                        {isEmployee ? (
                          <span className="text-xs text-gray-400 italic">
                            {r.status === 'Pending' ? 'In Review' : 'Finalized'}
                          </span>
                        ) : (
                          /* MANAGER & ADMIN: conditional action buttons */
                          r.status === 'Pending' ? (
                            isOwnRecord ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                                <Lock size={11} />
                                Self-Request (Pending HR)
                              </span>
                            ) : canTakeAction ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleApprove(r.id, r.empId, r.version)}
                                  disabled={isProcessingThis || !!processingId}
                                  title="Approve Regularization"
                                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isProcessingThis ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                                </button>
                                <button
                                  onClick={() => handleReject(r.id, r.empId, r.version)}
                                  disabled={isProcessingThis || !!processingId}
                                  title="Reject Regularization"
                                  className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isProcessingThis ? <Loader2 size={15} className="animate-spin" /> : <X size={15} />}
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400 italic">Not Assigned</span>
                            )
                          ) : (
                            <span className={`text-xs font-semibold ${
                              r.status === 'Approved' ? 'text-emerald-700' : 'text-red-700'
                            }`}>
                              {r.status}
                            </span>
                          )
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. Request Regularization Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { if (!formSubmitting) setIsModalOpen(false); }}
        title="Submit Attendance Correction Request"
        subtitle={`Correction entry for ${user?.name} (${user?.id})`}
        badge="Self-Service Portal"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              disabled={formSubmitting}
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={formSubmitting}
              onClick={handleSaveRequest}
              icon={formSubmitting ? <Loader2 size={14} className="animate-spin" /> : undefined}
            >
              {formSubmitting ? 'Submitting...' : 'Submit for Verification'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveRequest} className="space-y-3.5">
          {formError && (
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-700 font-semibold flex items-center gap-2">
              <ShieldAlert size={15} className="shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 flex items-center justify-between text-xs">
            <span className="text-gray-600 font-medium">Employee Identity:</span>
            <span className="font-bold text-gray-900">{user?.name} ({user?.id}) • {user?.department}</span>
          </div>

          <Input
            label="Incident Date *"
            placeholder="e.g. 16 Nov 2026"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            disabled={formSubmitting}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Correction Classification *</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as RegularizationRequest['type'] })}
              disabled={formSubmitting}
              className="w-full py-2.5 px-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6534E8]"
            >
              <option value="Missed Check-Out">Missed Check-Out Punch</option>
              <option value="Missed Check-In">Missed Check-In Punch</option>
              <option value="GPS Timeout / Device Glitch">GPS Timeout / Mobile Glitch</option>
              <option value="On-Duty Client Visit">On-Duty Client / Offsite Duty</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Original Punch Record (Read-Only)"
              value={form.originalPunch}
              readOnly
              disabled={formSubmitting}
              className="bg-gray-100 cursor-not-allowed text-gray-500"
            />
            <Input
              label="Requested Correction Time *"
              placeholder="e.g. Check-Out: 06:20 PM"
              value={form.requestedPunch}
              onChange={(e) => setForm({ ...form, requestedPunch: e.target.value })}
              disabled={formSubmitting}
              required
            />
          </div>

          <Input
            label="Detailed Reason & Explanation *"
            placeholder="Explain why the punch was missed or discrepancy occurred"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            disabled={formSubmitting}
            required
          />
        </form>
      </Modal>
    </div>
  );
};
