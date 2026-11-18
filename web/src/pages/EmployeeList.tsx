import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Search,
  Filter,
  UserPlus,
  Eye,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Building2,
  Mail,
  Calendar,
  Briefcase,
  Loader2,
  AlertTriangle,
  ShieldAlert,
  Camera,
  X,
  Upload
} from 'lucide-react';
import { Employee } from '../types';
import { Card, Badge, Button, Input, Modal, EmptyState } from '../components/ui';
import { useRefresh } from '../context/RefreshContext';
import * as api from '../services/api';

export const EmployeeList: React.FC = () => {
  const { registerRefreshHandler } = useRefresh();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Selected employee for modal
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add' | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Photo upload state
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add/Edit Form State
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    department: 'Engineering',
    designation: '',
    email: '',
    status: 'Active' as Employee['status'],
    joinDate: '16 Nov 2026'
  });

  const loadEmployees = useCallback(async () => {
    try {
      setFetchError(null);
      const data = await api.getEmployees();
      setEmployees(data);
    } catch (err: any) {
      console.error('Failed to load employees:', err);
      setFetchError(err.message || 'Unable to retrieve employee list.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    return registerRefreshHandler(async () => {
      await loadEmployees();
    });
  }, [registerRefreshHandler, loadEmployees]);

  // Departments list
  const departments = useMemo(() => {
    return ['All', ...Array.from(new Set(employees.map((e) => e.department)))];
  }, [employees]);

  // Filtered list
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;
      const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employees, searchTerm, departmentFilter, statusFilter]);

  // Paginated records
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1;
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(start, start + itemsPerPage);
  }, [filteredEmployees, currentPage]);

  const handleOpenModal = (mode: 'view' | 'edit' | 'add', emp?: Employee) => {
    setFormError(null);
    setPhotoError(null);
    setModalMode(mode);
    if (emp) {
      setSelectedEmployee(emp);
      setPhotoDataUrl(emp.avatar || null);
      setFormData({
        id: emp.id,
        name: emp.name,
        department: emp.department,
        designation: emp.designation,
        email: emp.email,
        status: emp.status,
        joinDate: emp.joinDate || '16 Nov 2026'
      });
    } else {
      setSelectedEmployee(null);
      setPhotoDataUrl(null);
      const nextId = `EMP-0${employees.length + 1}`.padStart(7, '0');
      setFormData({
        id: nextId,
        name: '',
        department: 'Engineering',
        designation: '',
        email: '',
        status: 'Active',
        joinDate: '16 Nov 2026'
      });
    }
  };

  const handleCloseModal = () => {
    if (formSubmitting) return;
    setModalMode(null);
    setSelectedEmployee(null);
    setPhotoDataUrl(null);
    setPhotoError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /** Handle file selection: validate type/size and read as base64 */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setPhotoError('Only JPG, PNG, and WebP files are supported.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('File exceeds the 5 MB limit. Please choose a smaller image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoDataUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Please provide employee full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('Please provide a valid work email.');
      return;
    }
    if (!formData.designation.trim()) {
      setFormError('Please enter the employee designation.');
      return;
    }

    setFormSubmitting(true);
    try {
      const payload = {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        designation: formData.designation.trim(),
        avatar: photoDataUrl || undefined,
      };

      if (modalMode === 'add') {
        const newEmp = await api.createEmployee(payload);
        setEmployees((prev) => [newEmp, ...prev]);
      } else if (modalMode === 'edit' && selectedEmployee) {
        const updated = await api.updateEmployee(selectedEmployee.id, payload);
        setEmployees((prev) =>
          prev.map((emp) => (emp.id === selectedEmployee.id ? { ...emp, ...updated } : emp))
        );
      }
      handleCloseModal();
    } catch (err: any) {
      console.error('Save employee error:', err);
      setFormError(err.message || 'Failed to save employee profile. Please retry.');
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
            Employee Management
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            View, search, and manage workforce profiles across branches
          </p>
        </div>

        <Button
          onClick={() => handleOpenModal('add')}
          icon={<UserPlus size={16} />}
        >
          Add Employee
        </Button>
      </div>

      {/* Fetch Error Notification */}
      {fetchError && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-600 shrink-0" />
            <span>{fetchError}</span>
          </div>
          <Button size="sm" variant="outline" onClick={loadEmployees}>
            Retry
          </Button>
        </div>
      )}

      {/* 2. Search & Filters Bar */}
      <Card padding="sm" className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="flex-1">
          <Input
            icon={<Search size={16} />}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Search by employee name, ID, designation, or email..."
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
            <Filter size={14} />
            <span>Filters:</span>
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6534E8]"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'All' ? 'All Departments' : dept}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6534E8]"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </Card>

      {/* 3. Employee Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Employee</th>
                <th className="py-3.5 px-4 sm:px-6">Department</th>
                <th className="py-3.5 px-4 sm:px-6">Designation</th>
                <th className="py-3.5 px-4 sm:px-6">Email</th>
                <th className="py-3.5 px-4 sm:px-6">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-gray-400">
                    <Loader2 size={24} className="animate-spin mx-auto text-[#6534E8] mb-2" />
                    Loading employee workforce directory...
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12">
                    <EmptyState
                      title="No employees found"
                      description="No employee records matched your search query or active filter selections."
                    />
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-purple-50/30 transition-colors">
                    {/* Employee Name & ID */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        {emp.avatar ? (
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-purple-100"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-purple-100 text-[#6534E8] font-bold text-xs flex items-center justify-center shrink-0">
                            {emp.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900 leading-tight">{emp.name}</p>
                          <p className="text-xs font-mono text-[#6534E8] mt-0.5">{emp.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4 sm:px-6 text-gray-700 font-medium">
                      {emp.department}
                    </td>

                    {/* Designation */}
                    <td className="py-3.5 px-4 sm:px-6 text-gray-600">
                      {emp.designation}
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 sm:px-6 text-gray-600 font-mono text-xs">
                      {emp.email}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <Badge
                        variant={
                          emp.status === 'Active'
                            ? 'present'
                            : emp.status === 'On Leave'
                            ? 'pending'
                            : 'absent'
                        }
                      >
                        {emp.status}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenModal('view', emp)}
                          title="View Profile"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-[#6534E8] hover:bg-purple-50 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenModal('edit', emp)}
                          title="Edit Employee"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-[#6534E8] hover:bg-purple-50 transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Table Pagination Footer */}
        {filteredEmployees.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <div>
              Showing{' '}
              <span className="font-semibold text-gray-700">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-gray-700">
                {Math.min(currentPage * itemsPerPage, filteredEmployees.length)}
              </span>{' '}
              of <span className="font-semibold text-gray-700">{filteredEmployees.length}</span> personnel
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                icon={<ChevronLeft size={14} />}
              >
                Previous
              </Button>
              <span className="px-2 font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                icon={<ChevronRight size={14} />}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* 5. View / Edit / Add Employee Modal */}
      <Modal
        isOpen={modalMode !== null}
        onClose={handleCloseModal}
        title={
          modalMode === 'add'
            ? 'Add New Employee'
            : modalMode === 'edit'
            ? `Edit Employee Profile • ${formData.id}`
            : 'Employee Profile Details'
        }
        subtitle={
          modalMode === 'add'
            ? 'Enter complete details to onboard an enterprise team member'
            : modalMode === 'edit'
            ? 'Update employee organization parameters'
            : `System profile verification for ${selectedEmployee?.name}`
        }
        badge={modalMode === 'add' ? 'Onboarding' : modalMode === 'edit' ? 'Admin Action' : 'Read Only'}
        footer={
          modalMode === 'view' ? (
            <Button size="sm" onClick={handleCloseModal}>
              Close
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" disabled={formSubmitting} onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={formSubmitting}
                onClick={handleSaveEmployee}
                icon={formSubmitting ? <Loader2 size={14} className="animate-spin" /> : undefined}
              >
                {formSubmitting
                  ? 'Saving...'
                  : modalMode === 'add'
                  ? 'Create Employee'
                  : 'Save Changes'}
              </Button>
            </>
          )
        }
      >
        {formError && (
          <div className="mb-3 p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-700 font-semibold flex items-center gap-2">
            <ShieldAlert size={15} className="shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {modalMode === 'view' && selectedEmployee ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-purple-50/50 border border-purple-100">
              {selectedEmployee.avatar ? (
                <img
                  src={selectedEmployee.avatar}
                  alt={selectedEmployee.name}
                  className="w-14 h-14 rounded-2xl object-cover shrink-0 ring-2 ring-purple-200 shadow-md"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-[#6534E8] text-white flex items-center justify-center font-bold text-xl shadow-md">
                  {selectedEmployee.name.charAt(0)}
                </div>
              )}
              <div>
                <h4 className="font-bold text-base text-gray-900">{selectedEmployee.name}</h4>
                <p className="text-xs text-gray-500">{selectedEmployee.designation}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant={selectedEmployee.status === 'Active' ? 'present' : 'pending'}>
                    {selectedEmployee.status}
                  </Badge>
                  <span className="text-xs font-mono text-gray-400">ID: {selectedEmployee.id}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 font-medium flex items-center gap-1.5 mb-1">
                  <Building2 size={13} />
                  Department
                </span>
                <p className="font-semibold text-gray-800">{selectedEmployee.department}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 font-medium flex items-center gap-1.5 mb-1">
                  <Mail size={13} />
                  Work Email
                </span>
                <p className="font-semibold text-gray-800 truncate">{selectedEmployee.email}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 font-medium flex items-center gap-1.5 mb-1">
                  <Calendar size={13} />
                  Joined Date
                </span>
                <p className="font-semibold text-gray-800">{selectedEmployee.joinDate || '12 Jan 2023'}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 font-medium flex items-center gap-1.5 mb-1">
                  <Briefcase size={13} />
                  Assigned Branch
                </span>
                <p className="font-semibold text-gray-800">PJN Tech HQ (Bangalore)</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveEmployee} className="space-y-3">

            {/* ── Profile Photo Upload ─────────────────────────────────── */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Profile Photo <span className="text-gray-400 font-normal">(optional · JPG, PNG, WebP · max 5 MB)</span></p>
              <div className="flex items-center gap-4">
                {/* Avatar preview circle */}
                <div className="relative shrink-0">
                  {photoDataUrl ? (
                    <img
                      src={photoDataUrl}
                      alt="Profile preview"
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-200 shadow"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-purple-100 text-[#6534E8] font-bold text-xl flex items-center justify-center ring-2 ring-purple-100">
                      {formData.name ? formData.name.charAt(0).toUpperCase() : <Camera size={20} className="opacity-50" />}
                    </div>
                  )}
                  {/* Camera overlay badge */}
                  {!photoDataUrl && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#6534E8] text-white flex items-center justify-center shadow">
                      <Camera size={10} />
                    </div>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  aria-label="Upload profile photo"
                  disabled={formSubmitting}
                  onChange={handleFileChange}
                />

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2">
                  {!photoDataUrl ? (
                    <button
                      type="button"
                      disabled={formSubmitting}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 min-h-[36px] px-4 py-1.5 rounded-full text-xs font-semibold text-white
                        bg-gradient-to-r from-[#59209B] to-[#86357E]
                        hover:brightness-110 hover:shadow-md hover:shadow-purple-400/30
                        active:scale-[0.97] active:brightness-95
                        focus:outline-none focus:ring-2 focus:ring-[#7352eb] focus:ring-offset-2
                        disabled:opacity-60 disabled:cursor-not-allowed transition-all select-none"
                    >
                      <Upload size={13} aria-hidden="true" />
                      Upload Photo
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled={formSubmitting}
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 min-h-[36px] px-4 py-1.5 rounded-full text-xs font-semibold text-white
                          bg-gradient-to-r from-[#59209B] to-[#86357E]
                          hover:brightness-110 hover:shadow-md hover:shadow-purple-400/30
                          active:scale-[0.97] active:brightness-95
                          focus:outline-none focus:ring-2 focus:ring-[#7352eb] focus:ring-offset-2
                          disabled:opacity-60 disabled:cursor-not-allowed transition-all select-none"
                      >
                        <Camera size={13} aria-hidden="true" />
                        Change Photo
                      </button>
                      <button
                        type="button"
                        disabled={formSubmitting}
                        onClick={() => {
                          setPhotoDataUrl(null);
                          setPhotoError(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="inline-flex items-center gap-1.5 min-h-[36px] px-4 py-1.5 rounded-full text-xs font-semibold
                          bg-white text-[#59209B] border border-purple-300
                          hover:bg-purple-50 hover:border-purple-400
                          active:scale-[0.97] active:bg-purple-100
                          focus:outline-none focus:ring-2 focus:ring-[#7352eb] focus:ring-offset-2
                          disabled:opacity-60 disabled:cursor-not-allowed transition-all select-none"
                      >
                        <X size={13} aria-hidden="true" />
                        Remove Photo
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Photo validation error */}
              {photoError && (
                <p className="mt-2 text-xs text-red-600 font-medium flex items-center gap-1.5">
                  <ShieldAlert size={13} className="shrink-0" />
                  {photoError}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-1" />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Employee ID"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                disabled={formSubmitting || modalMode === 'edit'}
                required
              />
              <Input
                label="Full Name *"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={formSubmitting}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Department *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  disabled={formSubmitting}
                  className="w-full py-2.5 px-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6534E8]"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Mobile Apps">Mobile Apps</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Quality Assurance">Quality Assurance</option>
                  <option value="DevOps & Cloud">DevOps & Cloud</option>
                </select>
              </div>

              <Input
                label="Designation *"
                placeholder="e.g. Frontend Engineer"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                disabled={formSubmitting}
                required
              />
            </div>

            <Input
              label="Work Email *"
              type="email"
              placeholder="e.g. name@pjntech.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={formSubmitting}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Employment Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Employee['status'] })}
                disabled={formSubmitting}
                className="w-full py-2.5 px-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6534E8]"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
