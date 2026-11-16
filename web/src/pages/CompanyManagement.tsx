import React, { useState } from 'react';
import {
  Building,
  MapPin,
  Plus,
  Compass,
  CheckCircle2,
  Users,
  Shield,
  Edit2
} from 'lucide-react';
import { Card, Badge, Button, Input, Modal } from '../components/ui';

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

const initialBranches: Branch[] = [
  {
    id: 'BR-01',
    name: 'PJN Tech Headquarters',
    code: 'BLR-HQ',
    address: 'EcoWorld Tech Park, Outer Ring Road, Bangalore - 560103',
    latitude: 12.9238,
    longitude: 77.6834,
    geofenceRadiusMeters: 100,
    employeeCount: 98,
    status: 'Active'
  },
  {
    id: 'BR-02',
    name: 'Chennai Innovation Hub',
    code: 'MAA-01',
    address: 'Tidel Park, Rajiv Gandhi Salai, Taramani, Chennai - 600113',
    latitude: 12.9897,
    longitude: 80.2486,
    geofenceRadiusMeters: 100,
    employeeCount: 36,
    status: 'Active'
  },
  {
    id: 'BR-03',
    name: 'Hyderabad Development Center',
    code: 'HYD-01',
    address: 'HITEC City, Madhapur, Hyderabad - 500081',
    latitude: 17.4485,
    longitude: 78.3742,
    geofenceRadiusMeters: 100,
    employeeCount: 20,
    status: 'Active'
  }
];

export const CompanyManagement: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeBranch, setActiveBranch] = useState<Branch | null>(null);

  const [branchForm, setBranchForm] = useState({
    name: '',
    code: '',
    address: '',
    latitude: '12.9716',
    longitude: '77.5946',
    geofenceRadiusMeters: 100
  });

  const handleOpenAdd = () => {
    setActiveBranch(null);
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

  const handleSaveBranch = (e: React.FormEvent) => {
    e.preventDefault();
    const newBranch: Branch = {
      id: `BR-0${branches.length + 1}`,
      name: branchForm.name,
      code: branchForm.code.toUpperCase(),
      address: branchForm.address,
      latitude: parseFloat(branchForm.latitude) || 12.9716,
      longitude: parseFloat(branchForm.longitude) || 77.5946,
      geofenceRadiusMeters: 100,
      employeeCount: 0,
      status: 'Active'
    };
    setBranches([...branches, newBranch]);
    setIsModalOpen(false);
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

      {/* 2. Tenant Overview Card */}
      <Card className="bg-gradient-to-r from-white to-purple-50/40 border border-purple-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#6338DF] text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#161A3D]">PJN Tech Solutions Pvt Ltd</h3>
                <Badge variant="present">Verified Tenant</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Tenant ID: <span className="font-mono font-semibold text-gray-700">TENANT-PJN-2026</span> • Enterprise Multi-Tenant Mode
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1.5">
                  <Building size={14} className="text-[#6338DF]" /> 3 Operating Branches
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

          <div className="p-3.5 rounded-xl bg-white border border-purple-100 shadow-sm shrink-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance Policy</p>
            <p className="text-sm font-bold text-[#161A3D] mt-0.5 flex items-center gap-1.5">
              <Compass size={15} className="text-[#6338DF]" />
              100m Geofence Enforced
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">Validated with backend GPS calculation</p>
          </div>
        </div>
      </Card>

      {/* 3. Branch List Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">Registered Company Branches</h3>
            <p className="text-xs text-gray-500">Each branch defines the physical GPS center point for attendance validation</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700">
            {branches.length} Branches
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Branch Code</th>
                <th className="py-3.5 px-4 sm:px-6">Branch Name</th>
                <th className="py-3.5 px-4 sm:px-6">Physical Address</th>
                <th className="py-3.5 px-4 sm:px-6">GPS Coordinates</th>
                <th className="py-3.5 px-4 sm:px-6">Geofence Radius</th>
                <th className="py-3.5 px-4 sm:px-6">Staff Count</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {branches.map((b) => (
                <tr key={b.id} className="hover:bg-purple-50/20 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-mono text-xs font-bold text-[#6338DF]">
                    {b.code}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-gray-900">
                    {b.name}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-gray-600 text-xs max-w-xs truncate">
                    {b.address}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-mono text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-red-500 shrink-0" />
                      {b.latitude.toFixed(4)}, {b.longitude.toFixed(4)}
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
                      onClick={() => { setActiveBranch(b); setIsModalOpen(true); }}
                      title="Edit Branch Coordinates"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#6338DF] hover:bg-purple-50 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. Add/Edit Branch Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeBranch ? `Edit Branch: ${activeBranch.name}` : 'Add Company Branch'}
        subtitle="Specify geofence coordinates for automated 100m attendance validation"
        badge="Day 2 Milestone"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveBranch}>
              Save Branch
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveBranch} className="space-y-3.5">
          <Input
            label="Branch Name"
            placeholder="e.g. Pune Tech Center"
            value={branchForm.name}
            onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
            required
          />

          <Input
            label="Branch Code"
            placeholder="e.g. PNQ-01"
            value={branchForm.code}
            onChange={(e) => setBranchForm({ ...branchForm, code: e.target.value })}
            required
          />

          <Input
            label="Office Address"
            placeholder="Building, Tech Park, City, PIN"
            value={branchForm.address}
            onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Latitude"
              placeholder="e.g. 18.5204"
              value={branchForm.latitude}
              onChange={(e) => setBranchForm({ ...branchForm, latitude: e.target.value })}
              required
            />
            <Input
              label="Longitude"
              placeholder="e.g. 73.8567"
              value={branchForm.longitude}
              onChange={(e) => setBranchForm({ ...branchForm, longitude: e.target.value })}
              required
            />
          </div>

          <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 text-xs text-[#6338DF]">
            <p className="font-semibold">Geofence Policy Compliance</p>
            <p className="mt-0.5 text-gray-600">
              Per PJN Tech business rules, check-in radius is locked to <strong>100 meters</strong> around these exact GPS coordinates.
            </p>
          </div>
        </form>
      </Modal>
    </div>
  );
};
