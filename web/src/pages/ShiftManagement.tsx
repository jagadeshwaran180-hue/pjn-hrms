import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Users,
  Edit2
} from 'lucide-react';
import { Card, Badge, Button, Input, Modal } from '../components/ui';

interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  graceTimeMinutes: number;
  assignedStaff: number;
  type: 'Regular' | 'Flexible' | 'Overnight';
}

const initialShifts: Shift[] = [
  {
    id: 'SH-01',
    name: 'General Corporate Shift',
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    graceTimeMinutes: 15,
    assignedStaff: 112,
    type: 'Regular'
  },
  {
    id: 'SH-02',
    name: 'Engineering Flexible Shift',
    startTime: '10:00 AM',
    endTime: '07:00 PM',
    graceTimeMinutes: 30,
    assignedStaff: 30,
    type: 'Flexible'
  },
  {
    id: 'SH-03',
    name: 'DevOps 24/7 Cloud Rotational',
    startTime: '09:00 PM',
    endTime: '06:00 AM',
    graceTimeMinutes: 10,
    assignedStaff: 12,
    type: 'Overnight'
  }
];

export const ShiftManagement: React.FC = () => {
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shiftForm, setShiftForm] = useState({
    name: '',
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    graceTimeMinutes: 15,
    type: 'Regular' as Shift['type']
  });

  const handleSaveShift = (e: React.FormEvent) => {
    e.preventDefault();
    const newShift: Shift = {
      id: `SH-0${shifts.length + 1}`,
      name: shiftForm.name,
      startTime: shiftForm.startTime,
      endTime: shiftForm.endTime,
      graceTimeMinutes: Number(shiftForm.graceTimeMinutes) || 15,
      assignedStaff: 0,
      type: shiftForm.type
    };
    setShifts([...shifts, newShift]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Shift Management & Rostering
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Configure working hours, late arrival grace windows, and departmental assignments
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} icon={<Plus size={16} />}>
          Create New Shift
        </Button>
      </div>

      {/* 2. Shift Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {shifts.map((s) => (
          <Card key={s.id} hoverable className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-[#6338DF]">{s.id}</span>
                <Badge
                  variant={
                    s.type === 'Regular'
                      ? 'present'
                      : s.type === 'Flexible'
                      ? 'purple'
                      : 'pending'
                  }
                >
                  {s.type}
                </Badge>
              </div>

              <h3 className="font-bold text-base text-gray-900">{s.name}</h3>

              <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-gray-700 font-semibold">
                  <span className="flex items-center gap-1.5 text-gray-500">
                    <Clock size={14} className="text-[#6338DF]" /> Timings:
                  </span>
                  <span>{s.startTime} – {s.endTime}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span className="text-gray-400">Grace Buffer:</span>
                  <span className="font-medium">{s.graceTimeMinutes} mins</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                <Users size={14} className="text-gray-400" />
                {s.assignedStaff} staff assigned
              </span>
              <button
                onClick={() => alert(`Editing shift ${s.id}`)}
                className="text-[#6338DF] hover:underline font-semibold flex items-center gap-1"
              >
                <Edit2 size={13} />
                <span>Edit</span>
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* 3. Add Shift Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Working Shift"
        subtitle="Define operational hours and attendance validation window"
        badge="Shift Config"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveShift}>
              Save Shift
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveShift} className="space-y-3.5">
          <Input
            label="Shift Title"
            placeholder="e.g. Afternoon Support Shift"
            value={shiftForm.name}
            onChange={(e) => setShiftForm({ ...shiftForm, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Time"
              placeholder="09:00 AM"
              value={shiftForm.startTime}
              onChange={(e) => setShiftForm({ ...shiftForm, startTime: e.target.value })}
              required
            />
            <Input
              label="End Time"
              placeholder="06:00 PM"
              value={shiftForm.endTime}
              onChange={(e) => setShiftForm({ ...shiftForm, endTime: e.target.value })}
              required
            />
          </div>

          <Input
            label="Late Grace Allowance (Minutes)"
            type="number"
            placeholder="15"
            value={shiftForm.graceTimeMinutes}
            onChange={(e) => setShiftForm({ ...shiftForm, graceTimeMinutes: Number(e.target.value) })}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Shift Classification</label>
            <select
              value={shiftForm.type}
              onChange={(e) => setShiftForm({ ...shiftForm, type: e.target.value as Shift['type'] })}
              className="w-full py-2.5 px-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6338DF]"
            >
              <option value="Regular">Regular Standard</option>
              <option value="Flexible">Flexible Core Hours</option>
              <option value="Overnight">Overnight Shift</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};
