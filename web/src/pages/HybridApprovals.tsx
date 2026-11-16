import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Calendar,
  ShieldAlert
} from 'lucide-react';
import { Card, Badge, Button, Modal, Input } from '../components/ui';

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
  }
];

export const HybridApprovals: React.FC = () => {
  const [requests, setRequests] = useState<HybridRequest[]>(initialHybridRequests);
  const [activeRequest, setActiveRequest] = useState<HybridRequest | null>(null);
  const [modalMode, setModalMode] = useState<'review' | 'revoke' | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [validUntilDate, setValidUntilDate] = useState('20 Nov 2026');

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const approvedCount = requests.filter((r) => r.status === 'Approved').length;
  const revokedCount = requests.filter((r) => r.status === 'Revoked').length;

  const handleOpenReview = (req: HybridRequest) => {
    setActiveRequest(req);
    setValidUntilDate(req.endDate);
    setActionReason('');
    setModalMode('review');
  };

  const handleOpenRevoke = (req: HybridRequest) => {
    setActiveRequest(req);
    setActionReason('');
    setModalMode('revoke');
  };

  const handleApprove = () => {
    if (!activeRequest) return;
    setRequests(
      requests.map((r) =>
        r.id === activeRequest.id
          ? {
              ...r,
              status: 'Approved',
              approvedBy: 'Admin (HR)',
              validUntil: validUntilDate
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
              approvedBy: 'Admin (HR)',
              rejectionReason: actionReason || 'Does not meet policy criteria'
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
              rejectionReason: actionReason || 'Revoked by HR administrator'
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
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Hybrid Work Approvals & Authorization
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Mandatory HR verification gateway before remote check-in is permitted by the system
          </p>
        </div>
        <Badge variant="purple" className="self-start sm:self-auto py-1 px-3">
          Enforced per Mandatory Business Requirement #5
        </Badge>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center justify-between border-l-4 border-amber-400">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Pending Review</p>
            <h3 className="text-2xl font-extrabold text-[#161A3D] mt-1">{pendingCount}</h3>
            <p className="text-xs text-amber-600 font-medium mt-0.5">Awaiting HR decision</p>
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
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">Hybrid Attendance Requests</h3>
            <p className="text-xs text-gray-500">Review, authorize, set validity, or revoke remote attendance requests</p>
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
                <th className="py-3.5 px-4 sm:px-6 text-right">HR Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-purple-50/20 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-mono text-xs font-bold text-[#6338DF]">
                    {req.id}
                  </td>

                  <td className="py-3.5 px-4 sm:px-6">
                    <p className="font-semibold text-gray-900">{req.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{req.empId} • {req.department}</p>
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
                      {req.rejectionReason && (
                        <span className="text-[10px] text-red-500">{req.rejectionReason}</span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    {req.status === 'Pending' && (
                      <Button size="sm" onClick={() => handleOpenReview(req)}>
                        Review & Decide
                      </Button>
                    )}
                    {req.status === 'Approved' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenRevoke(req)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Revoke Approval
                      </Button>
                    )}
                    {(req.status === 'Rejected' || req.status === 'Revoked') && (
                      <span className="text-xs text-gray-400 italic">Decision Logged</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. Review / Decision Modal */}
      <Modal
        isOpen={modalMode === 'review'}
        onClose={() => setModalMode(null)}
        title={`Review Hybrid Request: ${activeRequest?.id}`}
        subtitle="Enforce approval validity or reject with mandatory audit remarks"
        badge="HR Authorization"
        footer={
          <>
            <Button
              variant="danger"
              size="sm"
              onClick={handleReject}
            >
              Reject Request
            </Button>
            <Button
              size="sm"
              icon={<CheckCircle2 size={16} />}
              onClick={handleApprove}
            >
              Authorize Hybrid Work
            </Button>
          </>
        }
      >
        {activeRequest && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Employee</span>
                <span className="font-semibold text-gray-900">{activeRequest.name} ({activeRequest.empId})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Department</span>
                <span className="font-semibold text-gray-900">{activeRequest.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Requested Window</span>
                <span className="font-semibold text-gray-900">{activeRequest.startDate} — {activeRequest.endDate}</span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <span className="text-gray-500 font-medium block mb-1">Reason Stated:</span>
                <p className="text-gray-700 bg-white p-2 rounded border border-gray-200">{activeRequest.reason}</p>
              </div>
            </div>

            <Input
              label="Authorization Validity Expiry Date"
              value={validUntilDate}
              onChange={(e) => setValidUntilDate(e.target.value)}
              placeholder="e.g. 20 Nov 2026"
            />

            <Input
              label="Audit Remarks / Rejection Reason (If rejecting)"
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              placeholder="e.g. Approved per sprint guidelines"
            />
          </div>
        )}
      </Modal>

      {/* 5. Revocation Modal */}
      <Modal
        isOpen={modalMode === 'revoke'}
        onClose={() => setModalMode(null)}
        title="Revoke Hybrid Attendance Authorization"
        subtitle="This action immediately disables remote check-in for this employee"
        badge="Immediate Effect"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setModalMode(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleRevoke}>
              Confirm Revocation
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-2.5">
            <ShieldAlert size={18} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Security & Policy Notice</p>
              <p className="mt-0.5">
                Revoking this authorization will invalidate remote attendance credentials for <strong>{activeRequest?.name}</strong>. The employee will be required to check in within the 100m office geofence radius.
              </p>
            </div>
          </div>

          <Input
            label="Mandatory Revocation Reason (Logged to Audit Trail)"
            value={actionReason}
            onChange={(e) => setActionReason(e.target.value)}
            placeholder="e.g. Project emergency requiring on-site presence"
            required
          />
        </div>
      </Modal>
    </div>
  );
};
