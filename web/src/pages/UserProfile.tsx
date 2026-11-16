import React from 'react';
import {
  Mail,
  Calendar,
  Briefcase,
  MapPin,
  Clock,
  Shield,
  Award
} from 'lucide-react';
import { Card, Badge } from '../components/ui';

export const UserProfile: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 1. Profile Hero Banner */}
      <Card className="bg-gradient-to-r from-white via-purple-50/20 to-indigo-50/30 border border-purple-100">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-[#6338DF] text-white flex items-center justify-center font-extrabold text-3xl shadow-lg shadow-purple-500/25 shrink-0">
            J
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-2xl font-bold text-[#161A3D]">Jagadeesh K</h2>
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <Badge variant="purple">Web Frontend Lead</Badge>
                <Badge variant="present">Active Status</Badge>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Employee ID: <span className="font-mono font-semibold text-[#6338DF]">EMP-001</span> • Engineering Department • BLR-HQ
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1.5">
                <Mail size={14} className="text-[#6338DF]" /> jagadeesh@pjntech.com
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-red-500" /> Bangalore Headquarters (EcoWorld)
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-emerald-600" /> Joined 12 Jan 2023
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Three Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase">Monthly Attendance</p>
            <Clock size={16} className="text-[#6338DF]" />
          </div>
          <h3 className="text-2xl font-extrabold text-[#161A3D] mt-1">98.2%</h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            21 of 22 working days logged
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase">Available Time-Off</p>
            <Calendar size={16} className="text-emerald-600" />
          </div>
          <h3 className="text-2xl font-extrabold text-[#161A3D] mt-1">27 Days</h3>
          <p className="text-xs text-gray-500 mt-1">
            14 Annual • 8 Sick • 5 Casual
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase">Punctuality Score</p>
            <Award size={16} className="text-amber-500" />
          </div>
          <h3 className="text-2xl font-extrabold text-[#161A3D] mt-1">99.0%</h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            Avg. Check-In: 09:14 AM
          </p>
        </Card>
      </div>

      {/* 3. Detailed Profile Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Briefcase size={18} className="text-[#6338DF]" />
            <h3 className="font-bold text-gray-900 text-sm">Employment & Roster Details</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">Designation</span>
              <span className="font-semibold text-gray-800">Frontend Lead (React + TS)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">Department</span>
              <span className="font-semibold text-gray-800">Engineering</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">Assigned Shift</span>
              <span className="font-semibold text-gray-800">General Corporate (09:00 AM - 06:00 PM)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">Reporting Manager</span>
              <span className="font-semibold text-gray-800">Imran M (Project Lead)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-gray-500">Work Mode</span>
              <span className="font-semibold text-[#6338DF]">Hybrid Permitted (On Approval)</span>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Shield size={18} className="text-emerald-600" />
            <h3 className="font-bold text-gray-900 text-sm">Branch & Security Parameters</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">Assigned Physical Office</span>
              <span className="font-semibold text-gray-800">PJN Tech Headquarters (BLR-HQ)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">Office Coordinates</span>
              <span className="font-mono text-gray-800">12.9238° N, 77.6834° E</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">Check-In Geofence Policy</span>
              <span className="font-semibold text-emerald-700">100m Radius Enforced</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">Tenant Code</span>
              <span className="font-mono text-gray-800">TENANT-PJN-2026</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-gray-500">System Role</span>
              <Badge variant="purple">ADMIN & HR ACCESS</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
