import React, { useState, useEffect, useCallback } from 'react';
import {
  Clock,
  Plus,
  Users,
  Loader2,
  AlertTriangle,
  ShieldAlert
} from 'lucide-react';
import { Card, Badge, Button, Input, Modal } from '../components/ui';
import { useRefresh } from '../context/RefreshContext';
import * as api from '../services/api';

interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  graceTimeMinutes: number;
  assignedStaff: number;
  type: 'Regular' | 'Flexible' | 'Overnight';
}

export const ShiftManagement: React.FC = () => {
  const { registerRefreshHandler } = useRefresh();

  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [editForm, setEditForm] = useState({ name: '', startTime: '', endTime: '', graceTimeMinutes: 15, type: 'Regular' as Shift['type'] });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [shiftForm, setShiftForm] = useState({
    name: '',
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    graceTimeMinutes: 15,
    type: 'Regular' as Shift['type']
  });

  const loadShifts = useCallback(async () => {
    try {
      setFetchError(null);
      const data = await api.getShifts();
      setShifts(data);
    } catch (err: any) {
      console.error('Failed to load shifts:', err);
      setFetchError(err.message || 'Unable to load configured shifts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadShifts();
  }, [loadShifts]);

  useEffect(() => {
    return registerRefreshHandler(async () => {
      await loadShifts();
    });
  }, [registerRefreshHandler, loadShifts]);

  const handleSaveShift = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!shiftForm.name.trim()) {
      setFormError('Please enter a shift roster name.');
      return;
    }

    setFormSubmitting(true);
    try {
      const newShift = await api.createShift({
        name: shiftForm.name.trim(),
        startTime: shiftForm.startTime,
        endTime: shiftForm.endTime,
        graceTimeMinutes: Number(shiftForm.graceTimeMinutes) || 15,
        type: shiftForm.type
      });

      setShifts((prev) => [...prev, newShift]);
      setIsModalOpen(false);
      setShiftForm({
        name: '',
        startTime: '09:00 AM',
        endTime: '06:00 PM',
        graceTimeMinutes: 15,
        type: 'Regular'
      });
    } catch (err: any) {
      console.error('Create shift error:', err);
      setFormError(err.message || 'Failed to create shift. Please retry.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEditShift = (shift: Shift) => {
    setEditingShift(shift);
    setEditForm({ name: shift.name, startTime: shift.startTime, endTime: shift.endTime, graceTimeMinutes: shift.graceTimeMinutes, type: shift.type });
    setEditError(null);
    setIsEditModalOpen(true);
  };

  const handleUpdateShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShift) return;
    if (!editForm.name.trim()) { setEditError('Please enter a shift name.'); return; }
    setEditSubmitting(true);
    try {
      const updated = await api.updateShift(editingShift.id, {
        name: editForm.name.trim(),
        startTime: editForm.startTime,
        endTime: editForm.endTime,
        graceTimeMinutes: Number(editForm.graceTimeMinutes) || 15,
        type: editForm.type
      });
      setShifts(prev => prev.map(s => s.id === updated.id ? updated : s));
      setIsEditModalOpen(false);
      setEditingShift(null);
    } catch (err: any) {
      setEditError(err.message || 'Failed to update shift. Please retry.');
    } finally {
      setEditSubmitting(false);
    }
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

        <Button onClick={() => { setFormError(null); setIsModalOpen(true); }} icon={<Plus size={16} />}>
          Create New Shift
        </Button>
      </div>

      {fetchError && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-600 shrink-0" />
            <span>{fetchError}</span>
          </div>
          <Button size="sm" variant="outline" onClick={loadShifts}>
            Retry
          </Button>
        </div>
      )}

      {/* 2. Shift Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-xs text-gray-400">
            <Loader2 size={24} className="animate-spin mx-auto text-[#6534E8] mb-2" />
            Loading working shift schedules...
          </div>
        ) : (
          shifts.map((s) => (
            <Card key={s.id} hoverable className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-[#6534E8]">{s.id}</span>
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
                      <Clock size={14} className="text-[#6534E8]" /> Timings:
                    </span>
                    <span>{s.startTime} to {s.endTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="text-gray-400">Grace Buffer:</span>
                    <span className="font-medium">{s.graceTimeMinutes} mins</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500 flex items-center gap-1">
                  <Users size={13} className="text-emerald-600" />
                  <strong>{s.assignedStaff}</strong> staff enrolled
                </span>
                <button
                  onClick={() => handleEditShift(s)}
                  className="text-[11px] font-semibold text-[#6534E8] hover:underline px-2 py-1 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  Edit
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* 3. Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { if (!formSubmitting) setIsModalOpen(false); }}
        title="Create Working Shift"
        subtitle="Define attendance window and late grace threshold"
        badge="Roster Rules"
        footer={
          <>
            <Button variant="outline" size="sm" disabled={formSubmitting} onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={formSubmitting}
              onClick={handleSaveShift}
              icon={formSubmitting ? <Loader2 size={14} className="animate-spin" /> : undefined}
            >
              {formSubmitting ? 'Saving...' : 'Save Shift'}
            </Button>
          </>
        }
      >
        {formError && (
          <div className="mb-3 p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-700 font-semibold flex items-center gap-2">
            <ShieldAlert size={15} className="shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSaveShift} className="space-y-3.5">
          <Input
            label="Shift Title *"
            placeholder="e.g. Afternoon Production Shift"
            value={shiftForm.name}
            onChange={(e) => setShiftForm({ ...shiftForm, name: e.target.value })}
            disabled={formSubmitting}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Time *"
              value={shiftForm.startTime}
              onChange={(e) => setShiftForm({ ...shiftForm, startTime: e.target.value })}
              disabled={formSubmitting}
              required
            />
            <Input
              label="End Time *"
              value={shiftForm.endTime}
              onChange={(e) => setShiftForm({ ...shiftForm, endTime: e.target.value })}
              disabled={formSubmitting}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Late Grace Window (Mins)"
              type="number"
              value={shiftForm.graceTimeMinutes}
              onChange={(e) => setShiftForm({ ...shiftForm, graceTimeMinutes: Number(e.target.value) })}
              disabled={formSubmitting}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Shift Classification</label>
              <select
                value={shiftForm.type}
                onChange={(e) => setShiftForm({ ...shiftForm, type: e.target.value as Shift['type'] })}
                disabled={formSubmitting}
                className="w-full py-2.5 px-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6534E8]"
              >
                <option value="Regular">Regular</option>
                <option value="Flexible">Flexible</option>
                <option value="Overnight">Overnight</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Shift Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => { if (!editSubmitting) { setIsEditModalOpen(false); setEditingShift(null); } }}
        title="Edit Working Shift"
        subtitle={`Modifying ${editingShift?.id ?? ''} — ${editingShift?.name ?? ''}`}
        badge="Roster Rules"
        footer={
          <>
            <Button variant="outline" size="sm" disabled={editSubmitting} onClick={() => { setIsEditModalOpen(false); setEditingShift(null); }}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={editSubmitting}
              onClick={handleUpdateShift}
              icon={editSubmitting ? <Loader2 size={14} className="animate-spin" /> : undefined}
            >
              {editSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        }
      >
        {editError && (
          <div className="mb-3 p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-700 font-semibold flex items-center gap-2">
            <ShieldAlert size={15} className="shrink-0" />
            <span>{editError}</span>
          </div>
        )}
        <form onSubmit={handleUpdateShift} className="space-y-3.5">
          <Input
            label="Shift Title *"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            disabled={editSubmitting}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Time *"
              value={editForm.startTime}
              onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
              disabled={editSubmitting}
              required
            />
            <Input
              label="End Time *"
              value={editForm.endTime}
              onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
              disabled={editSubmitting}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Late Grace Window (Mins)"
              type="number"
              value={editForm.graceTimeMinutes}
              onChange={(e) => setEditForm({ ...editForm, graceTimeMinutes: Number(e.target.value) })}
              disabled={editSubmitting}
              required
            />
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Shift Classification</label>
              <select
                value={editForm.type}
                onChange={(e) => setEditForm({ ...editForm, type: e.target.value as Shift['type'] })}
                disabled={editSubmitting}
                className="w-full py-2.5 px-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6534E8]"
              >
                <option value="Regular">Regular</option>
                <option value="Flexible">Flexible</option>
                <option value="Overnight">Overnight</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
