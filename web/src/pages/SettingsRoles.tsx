import React, { useState } from 'react';
import {
  Shield,
  Compass,
  CheckCircle2,
  Save,
  AlertTriangle
} from 'lucide-react';
import { Card, Badge, Button, Input } from '../components/ui';
import { useAuth } from '../context/AuthContext';

interface RolePermission {
  module: string;
  admin: boolean;
  hr: boolean;
  manager: boolean;
  employee: boolean;
}

const initialPermissions: RolePermission[] = [
  { module: 'Dashboard & KPI Insights', admin: true, hr: true, manager: true, employee: true },
  { module: 'Employee CRUD & Profile Management', admin: true, hr: true, manager: false, employee: false },
  { module: 'GPS Attendance Marking (100m Geofence)', admin: true, hr: true, manager: true, employee: true },
  { module: 'Hybrid Attendance Approval & Revocation', admin: true, hr: true, manager: false, employee: false },
  { module: 'Shift Scheduling & Assignment', admin: true, hr: true, manager: true, employee: false },
  { module: 'Company Branch & GPS Setup', admin: true, hr: false, manager: false, employee: false },
  { module: 'Executive Reports & Analytics Export', admin: true, hr: true, manager: true, employee: false },
  { module: 'System Security & Audit Logs', admin: true, hr: false, manager: false, employee: false }
];

export const SettingsRoles: React.FC = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<RolePermission[]>(initialPermissions);
  const [geofenceRadius, setGeofenceRadius] = useState('100');
  const [lateGraceMinutes, setLateGraceMinutes] = useState('15');
  const [savedNotification, setSavedNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isAdmin = user?.role === 'ADMIN';

  const togglePermission = (index: number, role: 'admin' | 'hr' | 'manager' | 'employee') => {
    if (!isAdmin) {
      setErrorMessage('Permission Denied: Only Super Administrators can modify role matrix settings.');
      return;
    }
    const updated = [...permissions];
    updated[index][role] = !updated[index][role];
    setPermissions(updated);
  };

  const handleSaveSettings = () => {
    if (!isAdmin) {
      setErrorMessage('Access Denied: You must be signed in as an Administrator to commit changes.');
      return;
    }
    setErrorMessage(null);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Settings, Roles & Access Control
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-[#6338DF] border border-purple-200">
              ADMIN ONLY
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Configure system rules, RBAC role permissions, and attendance enforcement parameters
          </p>
        </div>

        <Button
          onClick={handleSaveSettings}
          disabled={!isAdmin}
          icon={<Save size={16} />}
        >
          Save Configuration
        </Button>
      </div>

      {savedNotification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>System configuration and role permissions successfully saved!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <AlertTriangle size={16} className="text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 2. Top Config Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Geofence & Attendance Rules */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#6338DF] flex items-center justify-center">
              <Compass size={18} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Attendance Geofence Rules</h3>
              <p className="text-xs text-gray-500">Configure GPS radius tolerance and punctuality buffer</p>
            </div>
          </div>

          <div className="space-y-3">
            <Input
              label="Mandatory Office Geofence Radius (Meters)"
              value={geofenceRadius}
              onChange={(e) => setGeofenceRadius(e.target.value)}
              placeholder="100"
              disabled={!isAdmin}
            />
            <p className="text-[11px] text-gray-400">
              * Per Section 4 business requirements, 100 meters is the mandated maximum radius.
            </p>

            <Input
              label="Late Arrival Grace Window (Minutes)"
              value={lateGraceMinutes}
              onChange={(e) => setLateGraceMinutes(e.target.value)}
              placeholder="15"
              disabled={!isAdmin}
            />
          </div>
        </Card>

        {/* Multi-Tenant Security & Isolation */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Shield size={18} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Tenant Isolation & Security</h3>
              <p className="text-xs text-gray-500">OWASP Top 10 (2025) compliance policies</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">Strict Tenant Isolation</p>
                <p className="text-gray-500 text-[11px]">Enforces database-level isolation per company</p>
              </div>
              <Badge variant="present">Enforced</Badge>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">GPS Tampering / Mock Location Defense</p>
                <p className="text-gray-500 text-[11px]">Validates coordinate altitude & spoofing signals</p>
              </div>
              <Badge variant="present">Active</Badge>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">JWT Token Rotation (15-min TTL)</p>
                <p className="text-gray-500 text-[11px]">Secures mobile & web REST API sessions</p>
              </div>
              <Badge variant="present">Active</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Role-Based Access Control (RBAC) Matrix */}
      <Card padding="none" className="overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">
              Role-Based Access Control (RBAC) Matrix
            </h3>
            <p className="text-xs text-gray-500">
              Control granular permissions for Admin, HR, Manager, and Employee tiers
            </p>
          </div>
          <Badge variant="purple">4 Defined System Roles</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Module / Operation</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">System Admin</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">HR Lead</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">Team Manager</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">Employee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {permissions.map((perm, idx) => (
                <tr key={perm.module} className="hover:bg-purple-50/20 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-gray-900 text-xs sm:text-sm">
                    {perm.module}
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-center">
                    <input
                      type="checkbox"
                      checked={perm.admin}
                      onChange={() => togglePermission(idx, 'admin')}
                      className="w-4 h-4 text-[#6338DF] rounded focus:ring-[#6338DF] accent-[#6338DF]"
                    />
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-center">
                    <input
                      type="checkbox"
                      checked={perm.hr}
                      onChange={() => togglePermission(idx, 'hr')}
                      className="w-4 h-4 text-[#6338DF] rounded focus:ring-[#6338DF] accent-[#6338DF]"
                    />
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-center">
                    <input
                      type="checkbox"
                      checked={perm.manager}
                      onChange={() => togglePermission(idx, 'manager')}
                      className="w-4 h-4 text-[#6338DF] rounded focus:ring-[#6338DF] accent-[#6338DF]"
                    />
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-center">
                    <input
                      type="checkbox"
                      checked={perm.employee}
                      onChange={() => togglePermission(idx, 'employee')}
                      className="w-4 h-4 text-[#6338DF] rounded focus:ring-[#6338DF] accent-[#6338DF]"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
