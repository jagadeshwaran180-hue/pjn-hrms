import React, { useState } from 'react';
import {
  CalendarCheck,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Check,
  X
} from 'lucide-react';
import { Card, Badge, Button, Input, Modal } from '../components/ui';

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
}

const initialLeaves: LeaveRecord[] = [
  {
    id: 'LR-101',
    empId: 'EMP-005',
    name: 'Arun Kumar',
    department: 'Human Resources',
    leaveType: 'Annual Leave',
    startDate: '18 Nov 2026',
    endDate: '20 Nov 2026',
    days: 3,
    reason: 'Family wedding event in native town',
    status: 'Pending',
    appliedOn: '15 Nov 2026'
  },
  {
    id: 'LR-102',
    empId: 'EMP-006',
    name: 'Priya S',
    department: 'Quality Assurance',
    leaveType: 'Sick Leave',
    startDate: '16 Nov 2026',
    endDate: '17 Nov 2026',
    days: 2,
    reason: 'Viral fever, resting under prescription',
    status: 'Approved',
    appliedOn: '15 Nov 2026'
  },
  {
    id: 'LR-103',
    empId: 'EMP-007',
    name: 'Rahul M',
    department: 'DevOps & Cloud',
    leaveType: 'Casual Leave',
    startDate: '21 Nov 2026',
    endDate: '21 Nov 2026',
    days: 1,
    reason: 'Personal bank and paperwork appointment',
    status: 'Pending',
    appliedOn: '16 Nov 2026'
  },
  {
    id: 'LR-104',
    empId: 'EMP-003',
    name: 'Karthick R',
    department: 'Mobile Apps',
    leaveType: 'Annual Leave',
    startDate: '01 Dec 2026',
    endDate: '05 Dec 2026',
    days: 5,
    reason: 'Year-end planned vacation',
    status: 'Approved',
    appliedOn: '10 Nov 2026'
  }
];

export const LeaveManagement: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveRecord[]>(initialLeaves);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const [applyForm, setApplyForm] = useState({
    name: 'Jagadeesh K',
    empId: 'EMP-001',
    department: 'Engineering',
    leaveType: 'Annual Leave' as LeaveRecord['leaveType'],
    startDate: '24 Nov 2026',
    endDate: '25 Nov 2026',
    days: 2,
    reason: ''
  });

  const handleApprove = (id: string) => {
    setLeaves(leaves.map((l) => (l.id === id ? { ...l, status: 'Approved' } : l)));
  };

  const handleReject = (id: string) => {
    setLeaves(leaves.map((l) => (l.id === id ? { ...l, status: 'Rejected' } : l)));
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: LeaveRecord = {
      id: `LR-${100 + leaves.length + 1}`,
      empId: applyForm.empId,
      name: applyForm.name,
      department: applyForm.department,
      leaveType: applyForm.leaveType,
      startDate: applyForm.startDate,
      endDate: applyForm.endDate,
      days: Number(applyForm.days) || 1,
      reason: applyForm.reason || 'Personal leave request',
      status: 'Pending',
      appliedOn: '16 Nov 2026'
    };
    setLeaves([newRecord, ...leaves]);
    setIsApplyModalOpen(false);
  };

  const filteredLeaves = leaves.filter((l) => {
    const matchType = filterType === 'All' || l.leaveType === filterType;
    const matchStatus = filterStatus === 'All' || l.status === filterStatus;
    return matchType && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Leave Management & Entitlements
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Submit leave requests, review departmental applications, and track quota balances
          </p>
        </div>

        <Button onClick={() => setIsApplyModalOpen(true)} icon={<Plus size={16} />}>
          Apply for Leave
        </Button>
      </div>

      {/* 2. Quota Balances Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center justify-between border-l-4 border-[#6338DF]">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Annual Leave Quota</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-[#161A3D]">14</span>
              <span className="text-xs text-gray-400">/ 18 days left</span>
            </div>
            <p className="text-[11px] text-purple-600 font-medium mt-0.5">Accrues 1.5 days/month</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-[#6338DF] flex items-center justify-center">
            <CalendarCheck size={20} />
          </div>
        </Card>

        <Card className="flex items-center justify-between border-l-4 border-emerald-500">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Sick Leave Quota</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-[#161A3D]">8</span>
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
            <p className="text-xs font-semibold text-gray-500 uppercase">Casual Leave Quota</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-[#161A3D]">5</span>
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
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">Leave Applications</h3>
            <p className="text-xs text-gray-500">Review employee leave applications and status</p>
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
                <th className="py-3.5 px-4 sm:px-6">Employee</th>
                <th className="py-3.5 px-4 sm:px-6">Leave Type</th>
                <th className="py-3.5 px-4 sm:px-6">Duration</th>
                <th className="py-3.5 px-4 sm:px-6">Reason</th>
                <th className="py-3.5 px-4 sm:px-6">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeaves.map((l) => (
                <tr key={l.id} className="hover:bg-purple-50/20 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-mono text-xs font-bold text-[#6338DF]">
                    {l.id}
                  </td>

                  <td className="py-3.5 px-4 sm:px-6">
                    <p className="font-semibold text-gray-900">{l.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{l.empId} • {l.department}</p>
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-xs font-medium text-gray-700">
                    {l.leaveType}
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-xs text-gray-700">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar size={13} className="text-[#6338DF]" />
                      {l.startDate} — {l.endDate}
                    </span>
                    <span className="text-[11px] text-gray-400">({l.days} {l.days === 1 ? 'day' : 'days'})</span>
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-xs text-gray-600 max-w-xs truncate" title={l.reason}>
                    {l.reason}
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
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    {l.status === 'Pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleApprove(l.id)}
                          title="Approve Leave"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                        >
                          <Check size={15} />
                        </button>
                        <button
                          onClick={() => handleReject(l.id)}
                          title="Reject Leave"
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. Apply Leave Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply for Employee Leave"
        subtitle="Submit your time-off dates for manager & HR review"
        badge="Self-Service Portal"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleApplySubmit}>
              Submit Application
            </Button>
          </>
        }
      >
        <form onSubmit={handleApplySubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Leave Category *</label>
            <select
              value={applyForm.leaveType}
              onChange={(e) => setApplyForm({ ...applyForm, leaveType: e.target.value as LeaveRecord['leaveType'] })}
              className="w-full py-2.5 px-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6338DF]"
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
              required
            />
            <Input
              label="To Date *"
              value={applyForm.endDate}
              onChange={(e) => setApplyForm({ ...applyForm, endDate: e.target.value })}
              placeholder="e.g. 25 Nov 2026"
              required
            />
          </div>

          <Input
            label="Total Days Count"
            type="number"
            value={applyForm.days}
            onChange={(e) => setApplyForm({ ...applyForm, days: Number(e.target.value) })}
            required
          />

          <Input
            label="Reason for Leave *"
            placeholder="Briefly state the reason for absence"
            value={applyForm.reason}
            onChange={(e) => setApplyForm({ ...applyForm, reason: e.target.value })}
            required
          />
        </form>
      </Modal>
    </div>
  );
};
