import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  Compass,
  CheckCircle2,
  Save,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { Card, Badge, Button, Input } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

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
  { module: 'System Security & Audit Logs', admin: true, hr: false, manager: false, employee: false },
  { module: 'Leave Management & Approvals', admin: true, hr: true, manager: true, employee: true },
  { module: 'Attendance Regularization & Correction', admin: true, hr: true, manager: true, employee: true },
  { module: 'Holiday Calendar & Company Observances', admin: true, hr: true, manager: true, employee: true }
];

export const SettingsRoles: React.FC = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<RolePermission[]>(initialPermissions);
  const [geofenceRadius, setGeofenceRadius] = useState('100');
  const [lateGraceMinutes, setLateGraceMinutes] = useState('15');
  const [savedNotification, setSavedNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  const loadSettings = useCallback(async () => {
    try {
      const data = await api.getSettings();
      if (data) {
        if (data.geofenceRadiusMeters) setGeofenceRadius(String(data.geofenceRadiusMeters));
        if (data.lateGraceMinutes) setLateGraceMinutes(String(data.lateGraceMinutes));
        if (data.permissions && data.permissions.length > 0) setPermissions(data.permissions);
      }
    } catch (err: any) {
      console.warn('Using local default settings:', err.message);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const togglePermission = (index: number, role: 'admin' | 'hr' | 'manager' | 'employee') => {
    if (!isAdmin) {
      setErrorMessage('Permission Denied: Only Super Administrators can modify role matrix settings.');
      return;
    }
    const updated = [...permissions];
    updated[index][role] = !updated[index][role];
    setPermissions(updated);
  };

  const handleSaveSettings = async () => {
    if (!isAdmin) {
      setErrorMessage('Access Denied: You must be signed in as an Administrator to commit changes.');
      return;
    }
    setErrorMessage(null);
    setSaving(true);

    try {
      await api.updateSettings({
        geofenceRadiusMeters: Number(geofenceRadius) || 100,
        lateGraceMinutes: Number(lateGraceMinutes) || 15,
        permissions
      });

      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 3000);
    } catch (err: any) {
      console.error('Save settings error:', err);
      setErrorMessage(err.message || 'Failed to persist configuration to backend.');
    } finally {
      setSaving(false);
    }
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
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-[#6534E8] border border-purple-200">
              ADMIN ONLY
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Configure system rules, RBAC role permissions, and attendance enforcement parameters
          </p>
        </div>

        <Button
          onClick={handleSaveSettings}
          disabled={!isAdmin || saving}
          icon={saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        >
          {saving ? 'Saving...' : 'Save Configuration'}
        </Button>
      </div>

      {savedNotification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>System configuration and role permissions successfully saved to server!</span>
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
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#6534E8] flex items-center justify-center">
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
              disabled={!isAdmin || saving}
            />
            <p className="text-[11px] text-gray-400">
              * Per Section 4 business requirements, 100 meters is the mandated maximum radius.
            </p>

            <Input
              label="Late Arrival Grace Window (Minutes)"
              value={lateGraceMinutes}
              onChange={(e) => setLateGraceMinutes(e.target.value)}
              placeholder="15"
              disabled={!isAdmin || saving}
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
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
              <div>
                <p className="font-semibold text-gray-800">Multi-Tenant Tenant ID Validation</p>
                <p className="text-gray-500">Strict header enforcement on API gateway</p>
              </div>
              <Badge variant="present">Enforced</Badge>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
              <div>
                <p className="font-semibold text-gray-800">GPS Tampering / Mock Location Defense</p>
                <p className="text-gray-500">Server coordinate range validation</p>
              </div>
              <Badge variant="present">Enforced</Badge>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
              <div>
                <p className="font-semibold text-gray-800">Self-Approval Prohibition</p>
                <p className="text-gray-500">Dual-custody approval control</p>
              </div>
              <Badge variant="present">Enforced</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Role-Based Access Control (RBAC) Matrix */}
      <Card padding="none" className="overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">Role-Based Access Control (RBAC) Matrix</h3>
          <p className="text-xs text-gray-500">Module authorizations by user role</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-6">Module / Capability</th>
                <th className="py-3 px-4 text-center">Super Admin</th>
                <th className="py-3 px-4 text-center">HR Manager</th>
                <th className="py-3 px-4 text-center">Project Manager</th>
                <th className="py-3 px-4 text-center">Employee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {permissions.map((p, idx) => (
                <tr key={p.module} className="hover:bg-purple-50/20">
                  <td className="py-3 px-4 sm:px-6 font-medium text-gray-800">
                    {p.module}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={p.admin}
                      onChange={() => togglePermission(idx, 'admin')}
                      disabled={!isAdmin}
                      className="rounded text-[#6534E8] focus:ring-[#6534E8]"
                    />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={p.hr}
                      onChange={() => togglePermission(idx, 'hr')}
                      disabled={!isAdmin}
                      className="rounded text-[#6534E8] focus:ring-[#6534E8]"
                    />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={p.manager}
                      onChange={() => togglePermission(idx, 'manager')}
                      disabled={!isAdmin}
                      className="rounded text-[#6534E8] focus:ring-[#6534E8]"
                    />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={p.employee}
                      onChange={() => togglePermission(idx, 'employee')}
                      disabled={!isAdmin}
                      className="rounded text-[#6534E8] focus:ring-[#6534E8]"
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
