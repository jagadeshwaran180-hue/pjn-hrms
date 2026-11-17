import React, { useState } from 'react';
import {
  CalendarRange,
  Plus,
  Calendar,
  Building,
  Sparkles
} from 'lucide-react';
import { Card, Badge, Button, Input, Modal } from '../components/ui';

interface Holiday {
  id: string;
  name: string;
  date: string;
  dayOfWeek: string;
  type: 'Mandatory' | 'Optional Floater';
  branchApplicability: string;
}

const initialHolidays: Holiday[] = [
  { id: 'HOL-01', name: 'Republic Day', date: '26 Jan 2026', dayOfWeek: 'Monday', type: 'Mandatory', branchApplicability: 'All Branches' },
  { id: 'HOL-02', name: 'Maha Shivaratri', date: '16 Feb 2026', dayOfWeek: 'Monday', type: 'Optional Floater', branchApplicability: 'All Branches' },
  { id: 'HOL-03', name: 'Holi Festival', date: '25 Mar 2026', dayOfWeek: 'Wednesday', type: 'Mandatory', branchApplicability: 'All Branches' },
  { id: 'HOL-04', name: 'Ugadi / Gudi Padwa', date: '09 Apr 2026', dayOfWeek: 'Thursday', type: 'Mandatory', branchApplicability: 'BLR-HQ & HYD-01' },
  { id: 'HOL-05', name: 'May Day', date: '01 May 2026', dayOfWeek: 'Friday', type: 'Mandatory', branchApplicability: 'All Branches' },
  { id: 'HOL-06', name: 'Independence Day', date: '15 Aug 2026', dayOfWeek: 'Saturday', type: 'Mandatory', branchApplicability: 'All Branches' },
  { id: 'HOL-07', name: 'Gandhi Jayanti', date: '02 Oct 2026', dayOfWeek: 'Friday', type: 'Mandatory', branchApplicability: 'All Branches' },
  { id: 'HOL-08', name: 'Diwali (Deepavali)', date: '08 Nov 2026', dayOfWeek: 'Sunday', type: 'Mandatory', branchApplicability: 'All Branches' },
  { id: 'HOL-09', name: 'Kannada Rajyotsava', date: '01 Nov 2026', dayOfWeek: 'Sunday', type: 'Mandatory', branchApplicability: 'BLR-HQ Only' },
  { id: 'HOL-10', name: 'Christmas', date: '25 Dec 2026', dayOfWeek: 'Friday', type: 'Mandatory', branchApplicability: 'All Branches' }
];

export const HolidayCalendar: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays);
  const [selectedYear, setSelectedYear] = useState('2026');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [holidayForm, setHolidayForm] = useState({
    name: '',
    date: '',
    dayOfWeek: 'Monday',
    type: 'Mandatory' as Holiday['type'],
    branchApplicability: 'All Branches'
  });

  const handleSaveHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    const newHol: Holiday = {
      id: `HOL-${holidays.length + 1}`,
      name: holidayForm.name,
      date: holidayForm.date,
      dayOfWeek: holidayForm.dayOfWeek,
      type: holidayForm.type,
      branchApplicability: holidayForm.branchApplicability
    };
    setHolidays([...holidays, newHol]);
    setIsModalOpen(false);
  };

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
          <Button onClick={() => setIsModalOpen(true)} icon={<Plus size={16} />}>
            Add Holiday
          </Button>
        </div>
      </div>

      {/* 2. Year Selector Banner */}
      <Card padding="sm" className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6338DF] flex items-center justify-center">
            <CalendarRange size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900">Calendar Year {selectedYear}</h3>
            <p className="text-xs text-gray-500">Total {holidays.length} observed holidays</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800"
          >
            <option value="2026">Calendar Year 2026</option>
            <option value="2027">Calendar Year 2027</option>
          </select>
        </div>
      </Card>

      {/* 3. Holiday Grid / Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">Scheduled Holidays</h3>
          <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100">
            10 Mandatory • 2 Floaters
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Holiday Name</th>
                <th className="py-3.5 px-4 sm:px-6">Calendar Date</th>
                <th className="py-3.5 px-4 sm:px-6">Day</th>
                <th className="py-3.5 px-4 sm:px-6">Classification</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Branch Applicability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {holidays.map((h) => (
                <tr key={h.id} className="hover:bg-purple-50/20 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#6338DF] flex items-center justify-center font-bold text-xs shrink-0">
                        <Sparkles size={14} />
                      </div>
                      <span className="font-semibold text-gray-900">{h.name}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 font-mono text-xs font-medium text-gray-800">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#6338DF]" />
                      {h.date}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-xs text-gray-600">
                    {h.dayOfWeek}
                  </td>

                  <td className="py-3.5 px-4 sm:px-6">
                    <Badge variant={h.type === 'Mandatory' ? 'present' : 'purple'}>
                      {h.type}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-right text-xs font-medium text-gray-600">
                    <span className="inline-flex items-center gap-1">
                      <Building size={12} className="text-gray-400" />
                      {h.branchApplicability}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. Add Holiday Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Company Holiday"
        subtitle="Schedule a new recognized holiday for company operations"
        badge="HR Policy"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveHoliday}>
              Save Holiday
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveHoliday} className="space-y-3.5">
          <Input
            label="Holiday Title *"
            placeholder="e.g. New Year Holiday"
            value={holidayForm.name}
            onChange={(e) => setHolidayForm({ ...holidayForm, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Calendar Date *"
              placeholder="e.g. 01 Jan 2027"
              value={holidayForm.date}
              onChange={(e) => setHolidayForm({ ...holidayForm, date: e.target.value })}
              required
            />
            <Input
              label="Day of Week"
              placeholder="e.g. Friday"
              value={holidayForm.dayOfWeek}
              onChange={(e) => setHolidayForm({ ...holidayForm, dayOfWeek: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Holiday Type</label>
            <select
              value={holidayForm.type}
              onChange={(e) => setHolidayForm({ ...holidayForm, type: e.target.value as Holiday['type'] })}
              className="w-full py-2.5 px-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6338DF]"
            >
              <option value="Mandatory">Mandatory Official Holiday</option>
              <option value="Optional Floater">Optional Floater Holiday</option>
            </select>
          </div>

          <Input
            label="Branch Applicability"
            placeholder="e.g. All Branches or BLR-HQ Only"
            value={holidayForm.branchApplicability}
            onChange={(e) => setHolidayForm({ ...holidayForm, branchApplicability: e.target.value })}
            required
          />
        </form>
      </Modal>
    </div>
  );
};
