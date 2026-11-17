import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Calendar,
  ShieldAlert,
  Edit2,
  Lock
} from 'lucide-react';
import { Card, Badge, Button, Modal, Input } from '../components/ui';
import { useAuth } from '../context/AuthContext';

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
  validUntil?: string;
  rejectionReason?: string;
}

const initialHybridRequests: HybridRequest[] = [
  {
    id: 'HYB-201',
    empId: 'EMP-003',
    name: 'Karthick R',
    department: 'Mobile Apps',
    startDate: '18 Nov 2026',
    endDate: '20 Nov 2026',
    reason: 'Client device testing from home lab setup',
    status: 'Pending',
    appliedOn: '16 Nov 2026'
  },
  {
    id: 'HYB-202',
    empId: 'EMP-004',
    name: 'Ayesha N',
    department: 'Backend',
    startDate: '17 Nov 2026',
    endDate: '17 Nov 2026',
    reason: 'Sprint planning and offsite network maintenance',
    status: 'Approved',
    appliedOn: '15 Nov 2026',
    approvedBy: 'Admin (HR)',
    validUntil: '17 Nov 2026'
  },
  {
    id: 'HYB-203',
    empId: 'EMP-006',
    name: 'Priya S',
    department: 'Quality Assurance',
    startDate: '16 Nov 2026',
    endDate: '19 Nov 2026',
    reason: 'Personal recovery post-illness (doctor certified)',
    status: 'Approved',
    appliedOn: '14 Nov 2026',
    approvedBy: 'Admin (HR)',
    validUntil: '19 Nov 2026'
  },
  {
    id: 'HYB-204',
    empId: 'EMP-007',
    name: 'Rahul M',
    department: 'DevOps & Cloud',
    startDate: '10 Nov 2026',
    endDate: '12 Nov 2026',
    reason: 'Datacenter migration overnight shift recovery',
    status: 'Revoked',
    appliedOn: '08 Nov 2026',
    approvedBy: 'Admin (HR)',
    validUntil: '12 Nov 2026',
    rejectionReason: 'Revoked due to emergency on-site hardware upgrade'
  },
  {
    id: 'HYB-205',
    empId: 'EMP-002',
    name: 'Imran M',
    department: 'Engineering',
    startDate: '25 Nov 2026',
    endDate: '26 Nov 2026',
    reason: 'Architecture review remote focus sprint',
    status: 'Pending',
    appliedOn: '16 Nov 2026'
  }
];

export const HybridApprovals: React.FC = () => {
  const { user, canApprove } = useAuth();
  const [requests, setRequests] = useState<HybridRequest[]>(initialHybridRequests);
  const [activeRequest, setActiveRequest] = useState<HybridRequest | null>(null);
  const [modalMode, setModalMode] = useState<'review' | 'revoke' | 'edit' | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [validUntilDate, setValidUntilDate] = useState('20 Nov 2026');
  const [editStatus, setEditStatus] = useState<HybridRequest['status']>('Approved');
  const [actionError, setActionError] = useState<string | null>(null);

  const isManager = user?.role === 'MANAGER';

  // Filter requests strictly based on role
  const authorizedRequests = useMemo(() => {
    return requests.filter((req) => {
      // 1. Manager: their own requests + requests of their assigned team members
      if (isManager) {
        return req.empId === user?.id || (user?.managedTeam && user.managedTeam.includes(req.empId));
      }
      // 2. Admin & HR: all requests
      return true;
    });
  }, [requests, isManager, user]);

  const pendingCount = authorizedRequests.filter((r) => r.status === 'Pending').length;
  const approvedCount = authorizedRequests.filter((r) => r.status === 'Approved').length;
  const revokedCount = authorizedRequests.filter((r) => r.status === 'Revoked').length;

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

  const handleApprove = () => {
    if (!activeRequest) return;
    setRequests(
      requests.map((r) =>
        r.id === activeRequest.id
          ? {
              ...r,
              status: 'Approved',
              approvedBy: `${user?.name} (${user?.role})`,
              validUntil: validUntilDate,
              rejectionReason: undefined
            }
          : r
      )
    );
    setModalMode(null);
  };

  const handleReject = () => {
    if (!activeRequest) return;
    setRequests(
      requests.map((r) =>
        r.id === activeRequest.id
          ? {
              ...r,
              status: 'Rejected',
              approvedBy: `${user?.name} (${user?.role})`,
              rejectionReason: actionReason || 'Does not meet policy criteria',
              validUntil: undefined
            }
          : r
      )
    );
    setModalMode(null);
  };

  const handleRevoke = () => {
    if (!activeRequest) return;
    setRequests(
      requests.map((r) =>
        r.id === activeRequest.id
          ? {
              ...r,
              status: 'Revoked',
              rejectionReason: actionReason || `Revoked by ${user?.name}`
            }
          : r
      )
    );
    setModalMode(null);
  };

  const handleSaveEdit = () => {
    if (!activeRequest) return;
    setRequests(
      requests.map((r) =>
        r.id === activeRequest.id
          ? {
              ...r,
              status: editStatus,
              approvedBy: editStatus === 'Approved' ? `${user?.name} (${user?.role})` : r.approvedBy,
              validUntil: editStatus === 'Approved' ? validUntilDate : undefined,
              rejectionReason:
                editStatus === 'Rejected' || editStatus === 'Revoked'
                  ? actionReason || `Updated by ${user?.name}`
                  : undefined
            }
          : r
      )
    );
    setModalMode(null);
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
              user?.role === 'ADMIN' ? 'bg-purple-100 text-[#6338DF]' :
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
            Ã—
          </button>
        </div>
      )}

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center justify-between border-l-4 border-amber-400">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Pending Review</p>
            <h3 className="text-2xl font-extrabold text-[#161A3D] mt-1">{pendingCount}</h3>
            <p className="text-xs text-amber-600 font-medium mt-0.5">Awaiting manager decision</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircle size={20} />
          </div>
        </Card>

        <Card className="flex items-center justify-between border-l-4 border-emerald-500">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Active Approvals</p>
            <h3 className="text-2xl font-extrabold text-[#161A3D] mt-1">{approvedCount}</h3>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">Currently valid for remote</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </Card>

        <Card className="flex items-center justify-between border-l-4 border-red-500">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Revoked / Terminated</p>
            <h3 className="text-2xl font-extrabold text-[#161A3D] mt-1">{revokedCount}</h3>
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
                {authorizedRequests.length} requests
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
              {authorizedRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-gray-400">
                    No hybrid attendance requests found in your scope.
                  </td>
                </tr>
              ) : (
                authorizedRequests.map((req) => {
                  const isOwnRecord = req.empId === user?.id;
                  const canTakeAction = canApprove(req.empId);

                  return (
                    <tr key={req.id} className="hover:bg-purple-50/20 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-mono text-xs font-bold text-[#6338DF]">
                        {req.id}
                      </td>

                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-gray-900">{req.name}</p>
                          {isOwnRecord && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-[#6338DF]">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 font-mono">{req.empId} â€¢ {req.department}</p>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-xs text-gray-700">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Calendar size={13} className="text-[#6338DF]" />
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
                          {req.approvedBy && (
                            <span className="text-[10px] text-gray-500">By {req.approvedBy}</span>
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
                            Self-Request (Pending HR)
                          </span>
                        ) : canTakeAction ? (
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
                              className="text-gray-700 hover:text-[#6338DF] hover:border-purple-200"
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
          onClose={() => setModalMode(null)}
          title={`Review Hybrid Work Request â€¢ ${activeRequest.id}`}
          subtitle={`Employee: ${activeRequest.name} (${activeRequest.empId})`}
          badge="Awaiting Approval"
          footer={
            <div className="flex justify-end gap-2 w-full">
              <Button variant="outline" onClick={() => setModalMode(null)}>
                Cancel
              </Button>
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleReject}
              >
                Reject Request
              </Button>
              <Button onClick={handleApprove}>
                Authorize & Approve
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs space-y-1">
              <p><span className="font-semibold text-gray-700">Requested Period:</span> {activeRequest.startDate} â€” {activeRequest.endDate}</p>
              <p><span className="font-semibold text-gray-700">Department:</span> {activeRequest.department}</p>
              <p><span className="font-semibold text-gray-700">Stated Reason:</span> {activeRequest.reason}</p>
            </div>

            <Input
              label="Approved Validity Cutoff Date *"
              value={validUntilDate}
              onChange={(e) => setValidUntilDate(e.target.value)}
              placeholder="e.g. 20 Nov 2026"
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
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#6338DF]"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Revoke Modal */}
      {modalMode === 'revoke' && activeRequest && (
        <Modal
          isOpen={true}
          onClose={() => setModalMode(null)}
          title={`Revoke Hybrid Authorization â€¢ ${activeRequest.id}`}
          subtitle={`Employee: ${activeRequest.name} (${activeRequest.empId})`}
          badge="Early Termination"
          footer={
            <div className="flex justify-end gap-2 w-full">
              <Button variant="outline" onClick={() => setModalMode(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-700"
                onClick={handleRevoke}
              >
                Confirm Revocation
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
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500"
            />
          </div>
        </Modal>
      )}

      {/* Edit Decision Modal */}
      {modalMode === 'edit' && activeRequest && (
        <Modal
          isOpen={true}
          onClose={() => setModalMode(null)}
          title={`Edit Decision â€¢ ${activeRequest.id}`}
          subtitle={`Employee: ${activeRequest.name}`}
          badge="Audit Adjustment"
          footer={
            <div className="flex justify-end gap-2 w-full">
              <Button variant="outline" onClick={() => setModalMode(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save Decision Update
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
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
