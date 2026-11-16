import React, { useState } from 'react';
import {
  FileCheck2,
  Plus,
  Clock,
  Calendar,
  CheckCircle2,
  Check,
  X
} from 'lucide-react';
import { Card, Badge, Button, Input, Modal } from '../components/ui';

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
}

const initialRequests: RegularizationRequest[] = [
  {
    id: 'REG-501',
    empId: 'EMP-001',
    name: 'Jagadeesh K',
    department: 'Engineering',
    date: '14 Nov 2026',
    originalPunch: 'Check-In: 09:15 AM | Check-Out: --:--',
    requestedPunch: 'Check-Out: 06:30 PM',
    type: 'Missed Check-Out',
    reason: 'Left in a hurry for team client deployment meeting; forgot mobile punch',
    status: 'Pending',
    appliedOn: '15 Nov 2026'
  },
  {
    id: 'REG-502',
    empId: 'EMP-004',
    name: 'Ayesha N',
    department: 'Backend',
    date: '12 Nov 2026',
    originalPunch: 'Check-In: --:-- | Check-Out: 06:10 PM',
    requestedPunch: 'Check-In: 09:30 AM',
    type: 'GPS Timeout / Device Glitch',
    reason: 'Mobile OS location services were updating; logged on-site manually with security',
    status: 'Approved',
    appliedOn: '13 Nov 2026'
  },
  {
    id: 'REG-503',
    empId: 'EMP-007',
    name: 'Rahul M',
    department: 'DevOps & Cloud',
    date: '11 Nov 2026',
    originalPunch: 'Check-In: 10:45 AM | Check-Out: 07:15 PM',
    requestedPunch: 'Check-In: 09:00 AM (Client Location)',
    type: 'On-Duty Client Visit',
    reason: 'Traveled directly to AWS data center for physical rack inspection',
    status: 'Approved',
    appliedOn: '11 Nov 2026'
  }
];

export const AttendanceRegularization: React.FC = () => {
  const [requests, setRequests] = useState<RegularizationRequest[]>(initialRequests);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: 'Jagadeesh K',
    empId: 'EMP-001',
    department: 'Engineering',
    date: '16 Nov 2026',
    originalPunch: 'Check-In: 09:15 AM | Check-Out: --:--',
    requestedPunch: 'Check-Out: 06:15 PM',
    type: 'Missed Check-Out' as RegularizationRequest['type'],
    reason: ''
  });

  const handleApprove = (id: string) => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r)));
  };

  const handleReject = (id: string) => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r)));
  };

  const handleSaveRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: RegularizationRequest = {
      id: `REG-${500 + requests.length + 1}`,
      empId: form.empId,
      name: form.name,
      department: form.department,
      date: form.date,
      originalPunch: form.originalPunch,
      requestedPunch: form.requestedPunch,
      type: form.type,
      reason: form.reason || 'Attendance correction submitted',
      status: 'Pending',
      appliedOn: '16 Nov 2026'
    };
    setRequests([newReq, ...requests]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Attendance Regularization & Punch Corrections
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Resolve missed punches, device location timeouts, and on-duty customer visits
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} icon={<Plus size={16} />}>
          Request Regularization
        </Button>
      </div>

      {/* 2. KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center justify-between border-l-4 border-amber-400">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Pending Review</p>
            <h3 className="text-2xl font-extrabold text-[#161A3D] mt-1">
              {requests.filter((r) => r.status === 'Pending').length}
            </h3>
            <p className="text-xs text-amber-600 font-medium mt-0.5">Awaiting HR verification</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </Card>

        <Card className="flex items-center justify-between border-l-4 border-emerald-500">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Approved Adjustments</p>
            <h3 className="text-2xl font-extrabold text-[#161A3D] mt-1">
              {requests.filter((r) => r.status === 'Approved').length}
            </h3>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">Corrected in attendance ledger</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </Card>

        <Card className="flex items-center justify-between border-l-4 border-[#6338DF]">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Total Filed (Month)</p>
            <h3 className="text-2xl font-extrabold text-[#161A3D] mt-1">{requests.length}</h3>
            <p className="text-xs text-purple-600 font-medium mt-0.5">Under 2% workforce rate</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-[#6338DF] flex items-center justify-center">
            <FileCheck2 size={20} />
          </div>
        </Card>
      </div>

      {/* 3. Regularization Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">Regularization Audit Roster</h3>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700">
            {requests.length} Requests
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Request ID</th>
                <th className="py-3.5 px-4 sm:px-6">Employee</th>
                <th className="py-3.5 px-4 sm:px-6">Incident Date</th>
                <th className="py-3.5 px-4 sm:px-6">Original vs Requested Time</th>
                <th className="py-3.5 px-4 sm:px-6">Correction Category</th>
                <th className="py-3.5 px-4 sm:px-6">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-purple-50/20 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-mono text-xs font-bold text-[#6338DF]">
                    {r.id}
                  </td>

                  <td className="py-3.5 px-4 sm:px-6">
                    <p className="font-semibold text-gray-900">{r.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{r.empId} • {r.department}</p>
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-xs text-gray-700 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#6338DF]" />
                      {r.date}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-xs">
                    <p className="text-gray-400 line-through">{r.originalPunch}</p>
                    <p className="text-emerald-700 font-semibold">{r.requestedPunch}</p>
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-xs text-gray-700">
                    <p className="font-medium text-gray-900">{r.type}</p>
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
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    {r.status === 'Pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleApprove(r.id)}
                          title="Approve Regularization"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                        >
                          <Check size={15} />
                        </button>
                        <button
                          onClick={() => handleReject(r.id)}
                          title="Reject Regularization"
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Audited</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. Request Regularization Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Attendance Correction Request"
        subtitle="Provide incident details and requested timestamps for ledger alignment"
        badge="Self-Service Portal"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveRequest}>
              Submit for HR Review
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveRequest} className="space-y-3.5">
          <Input
            label="Incident Date *"
            placeholder="e.g. 16 Nov 2026"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Correction Classification *</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as RegularizationRequest['type'] })}
              className="w-full py-2.5 px-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6338DF]"
            >
              <option value="Missed Check-Out">Missed Check-Out Punch</option>
              <option value="Missed Check-In">Missed Check-In Punch</option>
              <option value="GPS Timeout / Device Glitch">GPS Timeout / Mobile Glitch</option>
              <option value="On-Duty Client Visit">On-Duty Client / Offsite Duty</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Original Punch Record"
              value={form.originalPunch}
              onChange={(e) => setForm({ ...form, originalPunch: e.target.value })}
              required
            />
            <Input
              label="Requested Correction Time *"
              placeholder="e.g. Check-Out: 06:20 PM"
              value={form.requestedPunch}
              onChange={(e) => setForm({ ...form, requestedPunch: e.target.value })}
              required
            />
          </div>

          <Input
            label="Detailed Reason & Explanation *"
            placeholder="Explain why the punch was missed or discrepancy occurred"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            required
          />
        </form>
      </Modal>
    </div>
  );
};
