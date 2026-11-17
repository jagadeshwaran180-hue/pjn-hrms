import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Construction, ArrowLeft, ShieldCheck, Clock } from 'lucide-react';

export const ComingSoon: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract module name from path
  const moduleSlug = location.pathname.split('/').pop() || 'Module';
  const moduleName = moduleSlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12 text-center max-w-2xl mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-purple-50 text-[#6338DF] flex items-center justify-center mx-auto mb-4 border border-purple-100">
        <Construction size={32} />
      </div>

      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 mb-3">
        <Clock size={12} />
        Scheduled in Execution Plan (Days 2–7)
      </span>

      <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
        {moduleName} Module
      </h2>
      <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
        This screen is part of the subsequent development milestones in the PJN Tech HRMS roadmap.
      </p>

      <div className="mt-6 p-4 rounded-xl bg-gray-50 text-left border border-gray-100 text-xs text-gray-600 space-y-2">
        <p className="font-semibold text-gray-800 flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-[#6338DF]" />
          Upcoming Integration Schedule:
        </p>
        <ul className="list-disc list-inside space-y-1 text-gray-500 pl-1">
          <li><strong>Day 2 (17 Nov):</strong> Company, Branch & Role Management</li>
          <li><strong>Day 3 (18 Nov):</strong> Full Employee CRUD & Profiles</li>
          <li><strong>Day 4 (19 Nov):</strong> GPS 100m Attendance Engine</li>
          <li><strong>Day 5 (20 Nov):</strong> Hybrid Attendance & Approval Workflows</li>
          <li><strong>Day 6 (21 Nov):</strong> Attendance History & Reporting Analytics</li>
        </ul>
      </div>

      <div className="mt-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6338DF] hover:bg-[#5229cb] text-white font-semibold text-xs transition-colors shadow-sm"
        >
          <ArrowLeft size={14} />
          <span>Return to Dashboard</span>
        </button>
      </div>
    </div>
  );
};
