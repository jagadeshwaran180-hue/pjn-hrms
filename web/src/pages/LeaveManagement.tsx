import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CalendarCheck,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
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

interface LeaveRecord {
  id: string;
  empId: string;
  name: string;
  department: string;
  leaveType: 'Annual Leave' | 'Sick Leave' | 'Casual Leave';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedOn: string;
  processedBy?: string;
  processedAt?: string;
  rejectionReason?: string;
  version: number;
}

export const LeaveManagement: React.FC = () => {
  const { user, canApprove } = useAuth();
  const { registerRefreshHandler } = useRefresh();

  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [actionError, setActionError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isEmployee = user?.role === 'EMPLOYEE';
  const isManager = user?.role === 'MANAGER';
  const isAdminOrHr = user?.role === 'ADMIN' || user?.role === 'HR';

  const [applyForm, setApplyForm] = useState({
    leaveType: 'Annual Leave' as LeaveRecord['leaveType'],
    startDate: '24 Nov 2026',
    endDate: '25 Nov 2026',
    days: 2,
    reason: ''
  });

  // Fetch leaves from persistent backend database
  const loadLeaves = useCallback(async () => {
    try {
      setFetchError(null);
      const data = await api.getLeaves();
      setLeaves(data);
    } catch (err: any) {
      console.error('Failed to load leaves:', err);
      setFetchError(err.message || 'Unable to load leave applications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaves();
  }, [loadLeaves]);

  // Hook into global Refresh (desktop button & pull-to-refresh)
  useEffect(() => {
    return registerRefreshHandler(async () => {
      await loadLeaves();
    });
  }, [registerRefreshHandler, loadLeaves]);

  // Handle Approve with backend persistence & concurrency checks
  const handleApprove = async (id: string, recordOwnerId: string, version: number) => {
    if (processingId) return; // Prevent repeated clicks
    setActionError(null);

    // Enforce approval policy check
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
      const updated = await api.decideLeave(id, 'Approved', undefined, version);
      // Immediately replace action buttons with Approved badge
      setLeaves((prev) => prev.map((l) => (l.id === id ? { ...l, ...updated, status: 'Approved' } : l)));
    } catch (err: any) {
      console.error('Approval failed:', err);
      setActionError(err.message || 'Approval decision could not be saved. Please retry.');
      if (err.latest) {
        // Concurrency conflict: update UI to reflect latest state from server
        setLeaves((prev) => prev.map((l) => (l.id === id ? { ...l, ...err.latest } : l)));
      }
    } finally {
      setProcessingId(null);
    }
  };

  // Handle Reject with backend persistence & concurrency checks
  const handleReject = async (id: string, recordOwnerId: string, version: number) => {
    if (processingId) return; // Prevent repeated clicks
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
      const updated = await api.decideLeave(
        id,
        'Rejected',
        'Request declined per departmental operational coverage guidelines',
        version
      );
      setLeaves((prev) => prev.map((l) => (l.id === id ? { ...l, ...updated, status: 'Rejected' } : l)));
    } catch (err: any) {
      console.error('Rejection failed:', err);
      setActionError(err.message || 'Rejection decision could not be saved. Please retry.');
      if (err.latest) {
        setLeaves((prev) => prev.map((l) => (l.id === id ? { ...l, ...err.latest } : l)));
      }
    } finally {
      setProcessingId(null);
    }
  };

  // Submit new leave application to backend database
  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!applyForm.startDate.trim()) {
      setFormError('Please provide a valid start date.');
      return;
    }
    if (!applyForm.endDate.trim()) {
      setFormError('Please provide a valid end date.');
      return;
    }
    if (!applyForm.reason.trim()) {
      setFormError('Please provide a reason for the leave application.');
      return;
    }
    if (applyForm.days <= 0) {
      setFormError('Leave days count must be at least 1 day.');
      return;
    }

    setFormSubmitting(true);
    try {
      const newLeave = await api.createLeave({
        leaveType: applyForm.leaveType,
        startDate: applyForm.startDate.trim(),
        endDate: applyForm.endDate.trim(),
        days: Number(applyForm.days) || 1,
        reason: applyForm.reason.trim(),
      });

      setLeaves((prev) => [newLeave, ...prev]);
      setIsApplyModalOpen(false);
      setApplyForm({
        leaveType: 'Annual Leave',
        startDate: '24 Nov 2026',
        endDate: '25 Nov 2026',
        days: 2,
        reason: '',
      });
    } catch (err: any) {
      console.error('Apply leave error:', err);
      setFormError(err.message || 'Failed to submit leave application. Please retry.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const filteredLeaves = useMemo(() => {
    return leaves.filter((l) => {
      const matchType = filterType === 'All' || l.leaveType === filterType;
      const matchStatus = filterStatus === 'All' || l.status === filterStatus;
      return matchType && matchStatus;
    });
  }, [leaves, filterType, filterStatus]);

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Leave Management & Entitlements
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
            {isEmployee && 'Submit leave requests and monitor the review status of your personal applications.'}
            {isManager && 'Review and approve leave applications for your assigned engineering team members.'}
            {isAdminOrHr && 'Full organizational leave oversight, departmental quotas, and authorized approvals.'}
          </p>
        </div>

        <Button onClick={() => { setFormError(null); setIsApplyModalOpen(true); }} icon={<Plus size={16} />}>
          Apply for Leave
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
          <Button size="sm" variant="outline" onClick={loadLeaves}>
            Retry
          </Button>
        </div>
      )}

      {/* 2. Quota Balances Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center justify-between border-l-4 border-[#6534E8]">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">
              {isEmployee ? 'My Annual Leave Quota' : 'Annual Leave Allocation'}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-[#151936]">14</span>
              <span className="text-xs text-gray-400">/ 18 days left</span>
            </div>
            <p className="text-[11px] text-purple-600 font-medium mt-0.5">Accrues 1.5 days/month</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-[#6534E8] flex items-center justify-center">
            <CalendarCheck size={20} />
          </div>
        </Card>

        <Card className="flex items-center justify-between border-l-4 border-emerald-500">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">
              {isEmployee ? 'My Sick Leave Quota' : 'Sick Leave Allocation'}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-[#151936]">8</span>
              <span className="text-xs text-gray-400">/ 12 days left</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Medical cert required for &gt;2 days</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </Card>

        <Card className="flex items-center justify-between border-l-4 border-amber-500">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">
              {isEmployee ? 'My Casual Leave Quota' : 'Casual Leave Allocation'}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-[#151936]">5</span>
              <span className="text-xs text-gray-400">/ 6 days left</span>
            </div>
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">Short-notice emergency leave</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </Card>
      </div>

      {/* 3. Leave Requests Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                {isEmployee ? 'My Leave Applications' : isManager ? 'Team Leave Applications' : 'All Leave Applications'}
              </h3>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 font-mono">
                {filteredLeaves.length} records
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {isEmployee
                ? 'Only your personal submissions are displayed here.'
                : isManager
                ? 'Showing your requests and applications from your assigned team members.'
                : 'All employee leave applications across all departments.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700"
            >
              <option value="All">All Leave Types</option>
              <option value="Annual Leave">Annual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Request ID</th>
                <th className="py-3.5 px-4 sm:px-6">Applicant</th>
                <th className="py-3.5 px-4 sm:px-6">Leave Type</th>
                <th className="py-3.5 px-4 sm:px-6">Requested Window</th>
                <th className="py-3.5 px-4 sm:px-6">Stated Reason</th>
                <th className="py-3.5 px-4 sm:px-6">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-gray-400">
                    <Loader2 size={24} className="animate-spin mx-auto text-[#6534E8] mb-2" />
                    Loading leave applications from backend database...
                  </td>
                </tr>
              ) : filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-gray-400">
                    No leave requests found matching the current filters.
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((l) => {
                  const isOwnRecord = l.empId === user?.id;
                  const canTakeAction = canApprove(l.empId);
                  const isProcessingThis = processingId === l.id;

                  return (
                    <tr key={l.id} className="hover:bg-purple-50/20 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-mono text-xs font-bold text-[#6534E8]">
                        {l.id}
                      </td>

                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-gray-900">{l.name}</p>
                          {isOwnRecord && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-[#6534E8]">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 font-mono">{l.empId} • {l.department}</p>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6">
                        <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
                          {l.leaveType}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-xs text-gray-700">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Calendar size={13} className="text-[#6534E8]" />
                          {l.startDate} to {l.endDate}
                        </span>
                        <span className="text-[11px] text-gray-400">({l.days} {l.days === 1 ? 'day' : 'days'})</span>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-xs text-gray-600 max-w-xs truncate" title={l.reason}>
                        {l.reason}
                        {l.rejectionReason && (
                          <p className="text-[10px] text-red-500 font-medium mt-0.5 truncate" title={l.rejectionReason}>
                            Reason: {l.rejectionReason}
                          </p>
                        )}
                      </td>

                      <td className="py-3.5 px-4 sm:px-6">
                        <Badge
                          variant={
                            l.status === 'Approved'
                              ? 'present'
                              : l.status === 'Pending'
                              ? 'pending'
                              : 'absent'
                          }
                        >
                          {l.status}
                        </Badge>
                        {l.processedBy && (
                          <p className="text-[10px] text-gray-400 mt-0.5">By {l.processedBy}</p>
                        )}
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        {/* EMPLOYEE: strictly no approve/reject buttons */}
                        {isEmployee ? (
                          <span className="text-xs text-gray-400 italic">
                            {l.status === 'Pending' ? 'In Review' : 'Finalized'}
                          </span>
                        ) : (
                          /* MANAGER & ADMIN: conditional action buttons */
                          l.status === 'Pending' ? (
                            isOwnRecord ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                                <Lock size={11} />
                                Self-Request (Pending HR)
                              </span>
                            ) : canTakeAction ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleApprove(l.id, l.empId, l.version)}
                                  disabled={isProcessingThis || !!processingId}
                                  title="Approve Leave"
                                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isProcessingThis ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                                </button>
                                <button
                                  onClick={() => handleReject(l.id, l.empId, l.version)}
                                  disabled={isProcessingThis || !!processingId}
                                  title="Reject Leave"
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
                              l.status === 'Approved' ? 'text-emerald-700' : 'text-red-700'
                            }`}>
                              {l.status}
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

      {/* 4. Apply Leave Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => { if (!formSubmitting) setIsApplyModalOpen(false); }}
        title="Apply for Employee Leave"
        subtitle={`Submitting time-off for ${user?.name} (${user?.id})`}
        badge="Self-Service Portal"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              disabled={formSubmitting}
              onClick={() => setIsApplyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={formSubmitting}
              onClick={handleApplySubmit}
              icon={formSubmitting ? <Loader2 size={14} className="animate-spin" /> : undefined}
            >
              {formSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleApplySubmit} className="space-y-3.5">
          {formError && (
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-700 font-semibold flex items-center gap-2">
              <ShieldAlert size={15} className="shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Read-only identity indicator */}
          <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 flex items-center justify-between text-xs">
            <span className="text-gray-600 font-medium">Applicant Identity:</span>
            <span className="font-bold text-gray-900">{user?.name} ({user?.id}) • {user?.department}</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Leave Category *</label>
            <select
              value={applyForm.leaveType}
              onChange={(e) => setApplyForm({ ...applyForm, leaveType: e.target.value as LeaveRecord['leaveType'] })}
              disabled={formSubmitting}
              className="w-full py-2.5 px-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6534E8]"
            >
              <option value="Annual Leave">Annual Leave (14 days available)</option>
              <option value="Sick Leave">Sick Leave (8 days available)</option>
              <option value="Casual Leave">Casual Leave (5 days available)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="From Date *"
              value={applyForm.startDate}
              onChange={(e) => setApplyForm({ ...applyForm, startDate: e.target.value })}
              placeholder="e.g. 24 Nov 2026"
              disabled={formSubmitting}
              required
            />
            <Input
              label="To Date *"
              value={applyForm.endDate}
              onChange={(e) => setApplyForm({ ...applyForm, endDate: e.target.value })}
              placeholder="e.g. 25 Nov 2026"
              disabled={formSubmitting}
              required
            />
          </div>

          <Input
            label="Total Days Count"
            type="number"
            min="1"
            value={applyForm.days}
            onChange={(e) => setApplyForm({ ...applyForm, days: Number(e.target.value) })}
            disabled={formSubmitting}
            required
          />

          <Input
            label="Reason for Leave *"
            placeholder="Briefly state the reason for absence"
            value={applyForm.reason}
            onChange={(e) => setApplyForm({ ...applyForm, reason: e.target.value })}
            disabled={formSubmitting}
            required
          />
        </form>
      </Modal>
    </div>
  );
};
