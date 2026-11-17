import React, { useState, useEffect, useCallback } from 'react';
import {
  Building,
  MapPin,
  Plus,
  Compass,
  CheckCircle2,
  Users,
  Shield,
  Edit2,
  Loader2,
  AlertTriangle,
  ShieldAlert
} from 'lucide-react';
import { Card, Badge, Button, Input, Modal } from '../components/ui';
import { useRefresh } from '../context/RefreshContext';
import * as api from '../services/api';

interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  latitude: number;
  longitude: number;
  geofenceRadiusMeters: number;
  employeeCount: number;
  status: 'Active' | 'Inactive';
}

export const CompanyManagement: React.FC = () => {
  const { registerRefreshHandler } = useRefresh();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeBranch, setActiveBranch] = useState<Branch | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [branchForm, setBranchForm] = useState({
    name: '',
    code: '',
    address: '',
    latitude: '12.9716',
    longitude: '77.5946',
    geofenceRadiusMeters: 100
  });

  const loadBranches = useCallback(async () => {
    try {
      setFetchError(null);
      const data = await api.getBranches();
      setBranches(data);
    } catch (err: any) {
      console.error('Failed to load branches:', err);
      setFetchError(err.message || 'Unable to load company branch locations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBranches();
  }, [loadBranches]);

  useEffect(() => {
    return registerRefreshHandler(async () => {
      await loadBranches();
    });
  }, [registerRefreshHandler, loadBranches]);

  const handleOpenAdd = () => {
    setActiveBranch(null);
    setFormError(null);
    setBranchForm({
      name: '',
      code: '',
      address: '',
      latitude: '12.9716',
      longitude: '77.5946',
      geofenceRadiusMeters: 100
    });
    setIsModalOpen(true);
  };

  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!branchForm.name.trim()) {
      setFormError('Branch name is required.');
      return;
    }
    if (!branchForm.code.trim()) {
      setFormError('Branch code is required.');
      return;
    }
    if (!branchForm.address.trim()) {
      setFormError('Branch address is required.');
      return;
    }

    setFormSubmitting(true);
    try {
      const newBranch = await api.createBranch({
        name: branchForm.name.trim(),
        code: branchForm.code.trim().toUpperCase(),
        address: branchForm.address.trim(),
        latitude: parseFloat(branchForm.latitude) || 12.9716,
        longitude: parseFloat(branchForm.longitude) || 77.5946,
        geofenceRadiusMeters: 100,
        employeeCount: 0,
        status: 'Active'
      });

      setBranches((prev) => [...prev, newBranch]);
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Failed to save branch:', err);
      setFormError(err.message || 'Failed to save branch. Please retry.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Company & Branch Management
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Configure tenant profiles, branch GPS coordinates, and 100m geofence policies
          </p>
        </div>

        <Button onClick={handleOpenAdd} icon={<Plus size={16} />}>
          Add New Branch
        </Button>
      </div>

      {fetchError && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-600 shrink-0" />
            <span>{fetchError}</span>
          </div>
          <Button size="sm" variant="outline" onClick={loadBranches}>
            Retry
          </Button>
        </div>
      )}

      {/* 2. Tenant Overview Card */}
      <Card className="bg-gradient-to-r from-white to-purple-50/40 border border-purple-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#6534E8] text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#151936]">PJN Tech Solutions Pvt Ltd</h3>
                <Badge variant="present">Verified Tenant</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Tenant ID: <span className="font-mono font-semibold text-gray-700">TENANT-PJN-2026</span> • Enterprise Multi-Tenant Mode
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1.5">
                  <Building size={14} className="text-[#6534E8]" /> {branches.length} Operating Branches
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={14} className="text-emerald-600" /> 154 Registered Employees
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield size={14} className="text-amber-600" /> OWASP Top 10 Compliant
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 text-xs text-[#6534E8] max-w-sm">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <Compass size={14} /> Mandatory Geofence Enforcement
            </div>
            <p className="text-gray-600">
              All in-house employee attendance events are validated against the branch coordinates below with a maximum allowed tolerance of 100 meters.
            </p>
          </div>
        </div>
      </Card>

      {/* 3. Branches Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">Operating Branch Offices</h3>
            <p className="text-xs text-gray-500">Configured geofences and GPS validation coordinates</p>
          </div>
          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 font-mono">
            {branches.length} locations
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Branch Code & Name</th>
                <th className="py-3.5 px-4 sm:px-6">Physical Address</th>
                <th className="py-3.5 px-4 sm:px-6">GPS Coordinates</th>
                <th className="py-3.5 px-4 sm:px-6">Allowed Radius</th>
                <th className="py-3.5 px-4 sm:px-6">Assigned Staff</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-gray-400">
                    <Loader2 size={24} className="animate-spin mx-auto text-[#6534E8] mb-2" />
                    Loading branch coordinates...
                  </td>
                </tr>
              ) : (
                branches.map((b) => (
                  <tr key={b.id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#6534E8] bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                          {b.code}
                        </span>
                        <p className="font-semibold text-gray-900">{b.name}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-xs text-gray-600 max-w-sm whitespace-normal break-words leading-relaxed" title={b.address}>
                      {b.address}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-red-500 shrink-0" />
                        {Number(b.latitude).toFixed(4)}, {Number(b.longitude).toFixed(4)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={12} />
                        {b.geofenceRadiusMeters} meters
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-gray-700">
                      {b.employeeCount} staff
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <button
                        onClick={() => {
                          setActiveBranch(b);
                          setBranchForm({
                            name: b.name,
                            code: b.code,
                            address: b.address,
                            latitude: String(b.latitude),
                            longitude: String(b.longitude),
                            geofenceRadiusMeters: b.geofenceRadiusMeters
                          });
                          setIsModalOpen(true);
                        }}
                        title="Edit Branch Coordinates"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#6534E8] hover:bg-purple-50 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. Add/Edit Branch Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { if (!formSubmitting) setIsModalOpen(false); }}
        title={activeBranch ? `Edit Branch: ${activeBranch.name}` : 'Add Company Branch'}
        subtitle="Specify geofence coordinates for automated 100m attendance validation"
        badge="Enterprise Location"
        footer={
          <>
            <Button variant="outline" size="sm" disabled={formSubmitting} onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={formSubmitting}
              onClick={handleSaveBranch}
              icon={formSubmitting ? <Loader2 size={14} className="animate-spin" /> : undefined}
            >
              {formSubmitting ? 'Saving...' : 'Save Branch'}
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

        <form onSubmit={handleSaveBranch} className="space-y-3.5">
          <Input
            label="Branch Name *"
            placeholder="e.g. Pune Tech Center"
            value={branchForm.name}
            onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
            disabled={formSubmitting}
            required
          />

          <Input
            label="Branch Code *"
            placeholder="e.g. PNQ-01"
            value={branchForm.code}
            onChange={(e) => setBranchForm({ ...branchForm, code: e.target.value })}
            disabled={formSubmitting}
            required
          />

          <Input
            label="Office Address *"
            placeholder="Building, Tech Park, City, PIN"
            value={branchForm.address}
            onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
            disabled={formSubmitting}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Latitude *"
              placeholder="e.g. 18.5204"
              value={branchForm.latitude}
              onChange={(e) => setBranchForm({ ...branchForm, latitude: e.target.value })}
              disabled={formSubmitting}
              required
            />
            <Input
              label="Longitude *"
              placeholder="e.g. 73.8567"
              value={branchForm.longitude}
              onChange={(e) => setBranchForm({ ...branchForm, longitude: e.target.value })}
              disabled={formSubmitting}
              required
            />
          </div>

          <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 text-xs text-[#6534E8]">
            <p className="font-semibold">Geofence Policy Compliance</p>
            <p className="mt-0.5 text-gray-600">
              Per Section 4 business rules, check-in radius is locked to <strong>100 meters</strong> around these exact GPS coordinates.
            </p>
          </div>
        </form>
      </Modal>
    </div>
  );
};
