import React, { useState, useEffect, useCallback } from 'react';
import {
  CalendarRange,
  Plus,
  Calendar,
  Building,
  Sparkles,
  Loader2,
  AlertTriangle,
  ShieldAlert
} from 'lucide-react';
import { Card, Badge, Button, Input, Modal } from '../components/ui';
import { useRefresh } from '../context/RefreshContext';
import * as api from '../services/api';

interface Holiday {
  id: string;
  name: string;
  date: string;
  dayOfWeek: string;
  type: 'Mandatory' | 'Optional Floater';
  branchApplicability: string;
}

export const HolidayCalendar: React.FC = () => {
  const { registerRefreshHandler } = useRefresh();

  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [selectedYear, setSelectedYear] = useState('2026');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [holidayForm, setHolidayForm] = useState({
    name: '',
    date: '',
    dayOfWeek: 'Monday',
    type: 'Mandatory' as Holiday['type'],
    branchApplicability: 'All Branches'
  });

  const loadHolidays = useCallback(async () => {
    try {
      setFetchError(null);
      const data = await api.getHolidays();
      setHolidays(data);
    } catch (err: any) {
      console.error('Failed to load holidays:', err);
      setFetchError(err.message || 'Unable to retrieve holiday schedule.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHolidays();
  }, [loadHolidays]);

  useEffect(() => {
    return registerRefreshHandler(async () => {
      await loadHolidays();
    });
  }, [registerRefreshHandler, loadHolidays]);

  const handleSaveHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!holidayForm.name.trim()) {
      setFormError('Please enter holiday festival/occasion name.');
      return;
    }
    if (!holidayForm.date.trim()) {
      setFormError('Please enter the holiday date (e.g. 15 Aug 2026).');
      return;
    }

    setFormSubmitting(true);
    try {
      const newHol = await api.createHoliday({
        name: holidayForm.name.trim(),
        date: holidayForm.date.trim(),
        dayOfWeek: holidayForm.dayOfWeek,
        type: holidayForm.type,
        branchApplicability: holidayForm.branchApplicability
      });

      setHolidays((prev) => [...prev, newHol]);
      setIsModalOpen(false);
      setHolidayForm({
        name: '',
        date: '',
        dayOfWeek: 'Monday',
        type: 'Mandatory',
        branchApplicability: 'All Branches'
      });
    } catch (err: any) {
      console.error('Create holiday error:', err);
      setFormError(err.message || 'Failed to save holiday. Please retry.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // BUG-021 & BUG-024: Filter holidays by selectedYear, then sort chronologically
  const filteredHolidays = holidays
    .filter((h) => h.date.includes(selectedYear))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // BUG-022: Derive counts from filteredHolidays
  const mandatoryCount = filteredHolidays.filter((h) => h.type === 'Mandatory').length;
  const floaterCount = filteredHolidays.filter((h) => h.type === 'Optional Floater').length;
  const totalCount = filteredHolidays.length;

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Company Holiday Calendar
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Official mandatory holidays, regional floater days, and branch observance schedules
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => { setFormError(null); setIsModalOpen(true); }} icon={<Plus size={16} />}>
            Add Holiday
          </Button>
        </div>
      </div>

      {fetchError && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-600 shrink-0" />
            <span>{fetchError}</span>
          </div>
          <Button size="sm" variant="outline" onClick={loadHolidays}>
            Retry
          </Button>
        </div>
      )}

      {/* 2. Year Selector Banner */}
      <Card padding="sm" className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6534E8] flex items-center justify-center">
            <CalendarRange size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900">Calendar Year {selectedYear}</h3>
            <p className="text-xs text-gray-500">{mandatoryCount} Mandatory • {floaterCount} Floaters ({totalCount} total)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6534E8]"
          >
            <option value="2026">Calendar Year 2026</option>
            <option value="2027">Calendar Year 2027</option>
          </select>
        </div>
      </Card>

      {/* 3. Holidays Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-xs text-gray-400">
            <Loader2 size={24} className="animate-spin mx-auto text-[#6534E8] mb-2" />
            Loading company holiday schedule...
          </div>
        ) : (
          filteredHolidays.map((h) => (
            <Card key={h.id} hoverable className="border-l-4 border-[#6534E8] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold font-mono text-[#6534E8] bg-purple-50 px-2 py-0.5 rounded">
                    {h.id}
                  </span>
                  <Badge variant={h.type === 'Mandatory' ? 'present' : 'purple'}>
                    {h.type}
                  </Badge>
                </div>

                <h3 className="font-bold text-base text-gray-900">{h.name}</h3>

                <div className="mt-3 space-y-1.5 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#6534E8]" />
                    <span className="font-semibold text-gray-800">{h.date}</span>
                    <span className="text-gray-400">({h.dayOfWeek})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building size={14} className="text-gray-400" />
                    <span>{h.branchApplicability}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1">
                  <Sparkles size={12} className="text-amber-500" /> Statutory Observance
                </span>
                <span className="text-emerald-600 font-semibold">Paid Leave</span>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* 4. Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { if (!formSubmitting) setIsModalOpen(false); }}
        title="Add Observed Holiday"
        subtitle="Schedule calendar holiday across corporate branches"
        badge="Company Calendar"
        footer={
          <>
            <Button variant="outline" size="sm" disabled={formSubmitting} onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={formSubmitting}
              onClick={handleSaveHoliday}
              icon={formSubmitting ? <Loader2 size={14} className="animate-spin" /> : undefined}
            >
              {formSubmitting ? 'Saving...' : 'Save Holiday'}
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

        <form onSubmit={handleSaveHoliday} className="space-y-3.5">
          <Input
            label="Holiday Title *"
            placeholder="e.g. Independence Day"
            value={holidayForm.name}
            onChange={(e) => setHolidayForm({ ...holidayForm, name: e.target.value })}
            disabled={formSubmitting}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date *"
              placeholder="e.g. 15 Aug 2026"
              value={holidayForm.date}
              onChange={(e) => setHolidayForm({ ...holidayForm, date: e.target.value })}
              disabled={formSubmitting}
              required
            />
            <Input
              label="Day of Week"
              value={holidayForm.dayOfWeek}
              onChange={(e) => setHolidayForm({ ...holidayForm, dayOfWeek: e.target.value })}
              disabled={formSubmitting}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Holiday Type</label>
              <select
                value={holidayForm.type}
                onChange={(e) => setHolidayForm({ ...holidayForm, type: e.target.value as Holiday['type'] })}
                disabled={formSubmitting}
                className="w-full py-2.5 px-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6534E8]"
              >
                <option value="Mandatory">Mandatory</option>
                <option value="Optional Floater">Optional Floater</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Branch Observance</label>
              <select
                value={holidayForm.branchApplicability}
                onChange={(e) => setHolidayForm({ ...holidayForm, branchApplicability: e.target.value })}
                disabled={formSubmitting}
                className="w-full py-2.5 px-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6534E8]"
              >
                <option value="All Branches">All Branches</option>
                <option value="BLR-HQ Only">BLR-HQ Only</option>
                <option value="MAA-01 Only">MAA-01 Only</option>
                <option value="HYD-01 Only">HYD-01 Only</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
