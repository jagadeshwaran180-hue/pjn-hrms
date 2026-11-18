import React, { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Calendar,
  ShieldAlert,
  Edit2,
  Lock,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { Card, Badge, Button, Modal, Input } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useRefresh } from '../context/RefreshContext';
import * as api from '../services/api';

interface HybridRequest {
  id: string;
  empId: string;
  name: string;
  department: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Revoked';
  appliedOn: string;
  approvedBy?: string;
  processedBy?: string;
  processedAt?: string;
  validUntil?: string;
  rejectionReason?: string;
  version: number;
}

export const HybridApprovals: React.FC = () => {
  const { user, canApprove } = useAuth();
  const { registerRefreshHandler } = useRefresh();

  const [requests, setRequests] = useState<HybridRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [activeRequest, setActiveRequest] = useState<HybridRequest | null>(null);
  const [modalMode, setModalMode] = useState<'review' | 'revoke' | 'edit' | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [validUntilDate, setValidUntilDate] = useState('20 Nov 2026');
  const [editStatus, setEditStatus] = useState<HybridRequest['status']>('Approved');
  const [actionError, setActionError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const isManager = user?.role === 'MANAGER';

  // Fetch hybrid requests from persistent backend
  const loadRequests = useCallback(async () => {
    try {
      setFetchError(null);
      const data = await api.getHybridRequests();
      setRequests(data);
    } catch (err: any) {
      console.error('Failed to load hybrid requests:', err);
      setFetchError(err.message || 'Unable to load hybrid requests.');
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

  // Helper to check if request is active today
  const isCurrentlyValidToday = (req: HybridRequest) => {
    if (req.status !== 'Approved') return false;
    const today = new Date('2026-11-17T00:00:00');
    const start = new Date(req.startDate);
    const end = new Date(req.validUntil || req.endDate);
    return today >= start && today <= end;
  };

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const approvedCount = requests.filter(isCurrentlyValidToday).length;
  const revokedCount = requests.filter((r) => r.status === 'Revoked').length;

  const handleOpenReview = (req: HybridRequest) => {
    setActionError(null);
    if (!canApprove(req.empId)) {
      setActionError('Policy: You cannot approve or decide your own hybrid request.');
      return;
    }
    setActiveRequest(req);
    setValidUntilDate(req.endDate);
    setActionReason('');
    setModalMode('review');
  };

  const handleOpenRevoke = (req: HybridRequest) => {
    setActionError(null);
    if (!canApprove(req.empId)) {
      setActionError('Policy: You cannot revoke decisions on your own request.');
      return;
    }
    setActiveRequest(req);
    setActionReason('');
    setModalMode('revoke');
  };

  const handleOpenEdit = (req: HybridRequest) => {
    setActionError(null);
    if (!canApprove(req.empId)) {
      setActionError('Policy: You cannot modify decisions on your own request.');
      return;
    }
    setActiveRequest(req);
    setEditStatus(req.status);
    setValidUntilDate(req.validUntil || req.endDate);
    setActionReason(req.rejectionReason || '');
    setModalMode('edit');
  };

  const handleApprove = async () => {
    if (!activeRequest || isProcessing) return;
    setIsProcessing(true);
    setActionError(null);

    try {
      const updated = await api.decideHybridRequest(activeRequest.id, 'approve', {
        validUntil: validUntilDate,
        reason: actionReason,
        expectedVersion: activeRequest.version,
      });

      setRequests((prev) => prev.map((r) => (r.id === activeRequest.id ? { ...r, ...updated, status: 'Approved' } : r)));
      setModalMode(null);
    } catch (err: any) {
      console.error('Approve hybrid error:', err);
      setActionError(err.message || 'Approval decision could not be saved. Please retry.');
      if (err.latest) {
        setRequests((prev) => prev.map((r) => (r.id === activeRequest.id ? { ...r, ...err.latest } : r)));
        setModalMode(null);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!activeRequest || isProcessing) return;
    setIsProcessing(true);
    setActionError(null);

    try {
      const updated = await api.decideHybridRequest(activeRequest.id, 'reject', {
        reason: actionReason || 'Does not meet policy criteria',
        expectedVersion: activeRequest.version,
      });

      setRequests((prev) => prev.map((r) => (r.id === activeRequest.id ? { ...r, ...updated, status: 'Rejected' } : r)));
      setModalMode(null);
    } catch (err: any) {
      console.error('Reject hybrid error:', err);
      setActionError(err.message || 'Rejection could not be saved. Please retry.');
      if (err.latest) {
        setRequests((prev) => prev.map((r) => (r.id === activeRequest.id ? { ...r, ...err.latest } : r)));
        setModalMode(null);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRevoke = async () => {
    if (!activeRequest || isProcessing) return;
    setIsProcessing(true);
    setActionError(null);

    try {
      const updated = await api.decideHybridRequest(activeRequest.id, 'revoke', {
        reason: actionReason || `Revoked by ${user?.name}`,
        expectedVersion: activeRequest.version,
      });

      setRequests((prev) => prev.map((r) => (r.id === activeRequest.id ? { ...r, ...updated, status: 'Revoked' } : r)));
      setModalMode(null);
    } catch (err: any) {
      console.error('Revoke hybrid error:', err);
      setActionError(err.message || 'Revocation could not be saved. Please retry.');
      if (err.latest) {
        setRequests((prev) => prev.map((r) => (r.id === activeRequest.id ? { ...r, ...err.latest } : r)));
        setModalMode(null);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!activeRequest || isProcessing) return;
    setIsProcessing(true);
    setActionError(null);

    try {
      const updated = await api.decideHybridRequest(activeRequest.id, 'edit', {
        status: editStatus,
        validUntil: validUntilDate,
        reason: actionReason,
        expectedVersion: activeRequest.version,
      });

      setRequests((prev) => prev.map((r) => (r.id === activeRequest.id ? { ...r, ...updated } : r)));
      setModalMode(null);
    } catch (err: any) {
      console.error('Edit hybrid error:', err);
      setActionError(err.message || 'Update could not be saved.');
      if (err.latest) {
        setRequests((prev) => prev.map((r) => (r.id === activeRequest.id ? { ...r, ...err.latest } : r)));
        setModalMode(null);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Hybrid Work Approvals & Authorization
            </h2>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              user?.role === 'ADMIN' ? 'bg-purple-100 text-[#6534E8]' :
              user?.role === 'HR' ? 'bg-blue-100 text-blue-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {user?.role} PORTAL
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {isManager
              ? 'Review and authorize remote work windows for your assigned engineering team.'
              : 'Mandatory HR verification gateway before remote check-in is permitted by the system.'}
          </p>
        </div>
        <Badge variant="purple" className="self-start sm:self-auto py-1 px-3">
          Authorized Review Gateway
        </Badge>
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

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center justify-between border-l-4 border-amber-400">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Pending Review</p>
            <h3 className="text-2xl font-extrabold text-[#151936] mt-1">{pendingCount}</h3>
            <p className="text-xs text-amber-600 font-medium mt-0.5">Awaiting HR / Admin review</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircle size={20} />
          </div>
        </Card>

        <Card className="flex items-center justify-between border-l-4 border-emerald-500">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Active Approvals</p>
            <h3 className="text-2xl font-extrabold text-[#151936] mt-1">{approvedCount}</h3>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">Currently valid for remote</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </Card>

        <Card className="flex items-center justify-between border-l-4 border-red-500">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Revoked / Terminated</p>
            <h3 className="text-2xl font-extrabold text-[#151936] mt-1">{revokedCount}</h3>
            <p className="text-xs text-red-600 font-medium mt-0.5">Early cancellation audit logged</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <ShieldAlert size={20} />
          </div>
        </Card>
      </div>

      {/* 3. Requests Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                {isManager ? 'Assigned Team Hybrid Requests' : 'All Hybrid Attendance Requests'}
              </h3>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 font-mono">
                {requests.length} requests
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {isManager
                ? 'Showing requests for you and your assigned team members.'
                : 'Review, authorize, edit decisions, set validity, or revoke remote attendance.'}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Request ID</th>
                <th className="py-3.5 px-4 sm:px-6">Employee</th>
                <th className="py-3.5 px-4 sm:px-6">Requested Window</th>
                <th className="py-3.5 px-4 sm:px-6">Stated Reason</th>
                <th className="py-3.5 px-4 sm:px-6">Status & Validity</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-gray-400">
                    <Loader2 size={24} className="animate-spin mx-auto text-[#6534E8] mb-2" />
                    Loading hybrid work applications...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-gray-400">
                    No hybrid attendance requests found in your scope.
                  </td>
                </tr>
              ) : (
                requests.map((req) => {
                  const isOwnRecord = req.empId === user?.id;
                  const canTakeAction = canApprove(req.empId);

                  return (
                    <tr key={req.id} className="hover:bg-purple-50/20 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-mono text-xs font-bold text-[#6534E8]">
                        {req.id}
                      </td>

                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-gray-900">{req.name}</p>
                          {isOwnRecord && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-[#6534E8]">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 font-mono">{req.empId} • {req.department}</p>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-xs text-gray-700">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Calendar size={13} className="text-[#6534E8]" />
                          {req.startDate} to {req.endDate}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-xs text-gray-600 max-w-xs">
                        <p className="truncate" title={req.reason}>{req.reason}</p>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant={
                              req.status === 'Approved'
                                ? 'present'
                                : req.status === 'Pending'
                                ? 'pending'
                                : 'absent'
                            }
                          >
                            {req.status}
                          </Badge>
                          {req.validUntil && req.status === 'Approved' && (
                            <span className="text-[10px] text-gray-400">Valid until {req.validUntil}</span>
                          )}
                          {req.processedBy && (
                            <span className="text-[10px] text-gray-500">By {req.processedBy}</span>
                          )}
                          {req.rejectionReason && (
                            <span className="text-[10px] text-red-500">{req.rejectionReason}</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        {isOwnRecord ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                            <Lock size={11} />
                            {req.status === 'Approved'
                              ? 'Approved (Self)'
                              : req.status === 'Rejected'
                              ? 'Rejected (Self)'
                              : 'Self-Request (Pending HR)'}
                          </span>
                        ) : canTakeAction && (user?.role === 'ADMIN' || user?.role === 'HR') ? (
                          <div className="flex items-center justify-end gap-1.5">
                            {req.status === 'Pending' && (
                              <Button size="sm" onClick={() => handleOpenReview(req)}>
                                Decide
                              </Button>
                            )}
                            {req.status === 'Approved' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenRevoke(req)}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                Revoke
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              icon={<Edit2 size={13} />}
                              onClick={() => handleOpenEdit(req)}
                              title="Edit decision"
                              className="text-gray-700 hover:text-[#6534E8] hover:border-purple-200"
                            >
                              Edit
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Not Authorized</span>
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

      {/* Review Modal */}
      {modalMode === 'review' && activeRequest && (
        <Modal
          isOpen={true}
          onClose={() => { if (!isProcessing) setModalMode(null); }}
          title={`Review Hybrid Work Request • ${activeRequest.id}`}
          subtitle={`Employee: ${activeRequest.name} (${activeRequest.empId})`}
          badge="Awaiting Approval"
          footer={
            <div className="flex justify-end gap-2 w-full">
              <Button variant="outline" disabled={isProcessing} onClick={() => setModalMode(null)}>
                Cancel
              </Button>
              <Button
                variant="outline"
                disabled={isProcessing}
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleReject}
              >
                Reject Request
              </Button>
              <Button
                disabled={isProcessing}
                onClick={handleApprove}
                icon={isProcessing ? <Loader2 size={14} className="animate-spin" /> : undefined}
              >
                {isProcessing ? 'Saving...' : 'Authorize & Approve'}
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs space-y-1">
              <p><span className="font-semibold text-gray-700">Requested Period:</span> {activeRequest.startDate} to {activeRequest.endDate}</p>
              <p><span className="font-semibold text-gray-700">Department:</span> {activeRequest.department}</p>
              <p><span className="font-semibold text-gray-700">Stated Reason:</span> {activeRequest.reason}</p>
            </div>

            <Input
              label="Approved Validity Cutoff Date *"
              value={validUntilDate}
              onChange={(e) => setValidUntilDate(e.target.value)}
              placeholder="e.g. 20 Nov 2026"
              disabled={isProcessing}
            />

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Approval / Rejection Remarks
              </label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Optional explanation notes for the employee..."
                rows={3}
                disabled={isProcessing}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#6534E8]"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Revoke Modal */}
      {modalMode === 'revoke' && activeRequest && (
        <Modal
          isOpen={true}
          onClose={() => { if (!isProcessing) setModalMode(null); }}
          title={`Revoke Hybrid Authorization • ${activeRequest.id}`}
          subtitle={`Employee: ${activeRequest.name} (${activeRequest.empId})`}
          badge="Early Termination"
          footer={
            <div className="flex justify-end gap-2 w-full">
              <Button variant="outline" disabled={isProcessing} onClick={() => setModalMode(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={isProcessing}
                className="bg-red-600 hover:bg-red-700"
                onClick={handleRevoke}
                icon={isProcessing ? <Loader2 size={14} className="animate-spin" /> : undefined}
              >
                {isProcessing ? 'Revoking...' : 'Confirm Revocation'}
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="text-xs text-gray-600">
              Revoking this approval immediately invalidates remote GPS punches for this employee. Please record an audit reason:
            </p>
            <textarea
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              placeholder="Reason for early cancellation..."
              rows={3}
              disabled={isProcessing}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500"
            />
          </div>
        </Modal>
      )}

      {/* Edit Decision Modal */}
      {modalMode === 'edit' && activeRequest && (
        <Modal
          isOpen={true}
          onClose={() => { if (!isProcessing) setModalMode(null); }}
          title={`Edit Decision • ${activeRequest.id}`}
          subtitle={`Employee: ${activeRequest.name}`}
          badge="Audit Adjustment"
          footer={
            <div className="flex justify-end gap-2 w-full">
              <Button variant="outline" disabled={isProcessing} onClick={() => setModalMode(null)}>
                Cancel
              </Button>
              <Button
                disabled={isProcessing}
                onClick={handleSaveEdit}
                icon={isProcessing ? <Loader2 size={14} className="animate-spin" /> : undefined}
              >
                {isProcessing ? 'Saving...' : 'Save Decision Update'}
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Updated Status *
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as HybridRequest['status'])}
                disabled={isProcessing}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              >
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
                <option value="Revoked">Revoked</option>
              </select>
            </div>

            {editStatus === 'Approved' && (
              <Input
                label="Valid Until Date"
                value={validUntilDate}
                onChange={(e) => setValidUntilDate(e.target.value)}
                disabled={isProcessing}
              />
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Remarks / Correction Reason
              </label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                rows={2}
                disabled={isProcessing}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
