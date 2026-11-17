import React, { useState, useMemo } from 'react';
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
  Briefcase
} from 'lucide-react';
import { mockEmployees } from '../data/mockData';
import { Employee } from '../types';
import { Card, Badge, Button, Input, Modal, EmptyState } from '../components/ui';

export const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Selected employee for modal
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add' | null>(null);

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
    setModalMode(mode);
    if (emp) {
      setSelectedEmployee(emp);
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
    setModalMode(null);
    setSelectedEmployee(null);
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const newEmp: Employee = {
        ...formData,
        id: formData.id || `EMP-0${employees.length + 1}`
      };
      setEmployees([newEmp, ...employees]);
    } else if (modalMode === 'edit' && selectedEmployee) {
      setEmployees(
        employees.map((emp) =>
          emp.id === selectedEmployee.id ? { ...emp, ...formData } : emp
        )
      );
    }
    handleCloseModal();
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

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6338DF]"
          >
            {departments.map((d) => (
              <option key={d} value={d}>Dept: {d}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6338DF]"
          >
            <option value="All">Status: All</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>

          {(searchTerm || departmentFilter !== 'All' || statusFilter !== 'All') && (
            <button
              onClick={() => { setSearchTerm(''); setDepartmentFilter('All'); setStatusFilter('All'); setCurrentPage(1); }}
              className="text-xs text-[#6338DF] hover:underline px-2 py-1 font-medium"
            >
              Reset
            </button>
          )}
        </div>
      </Card>

      {/* 3. Table Container */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Employee ID</th>
                <th className="py-3.5 px-4 sm:px-6">Employee Name</th>
                <th className="py-3.5 px-4 sm:px-6">Department</th>
                <th className="py-3.5 px-4 sm:px-6">Designation</th>
                <th className="py-3.5 px-4 sm:px-6">Email</th>
                <th className="py-3.5 px-4 sm:px-6">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedEmployees.length > 0 ? (
                paginatedEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-xs font-semibold text-[#6338DF]">
                      {emp.id}
                    </td>

                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-[#6338DF] font-bold text-xs flex items-center justify-center shrink-0">
                          {emp.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-gray-900">{emp.name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-gray-600 font-medium">
                      {emp.department}
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-gray-600">
                      {emp.designation}
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-gray-500 font-mono text-xs">
                      {emp.email}
                    </td>

                    <td className="py-3.5 px-4 sm:px-6">
                      <Badge
                        variant={
                          emp.status === 'Active'
                            ? 'present'
                            : emp.status === 'On Leave'
                            ? 'pending'
                            : 'neutral'
                        }
                      >
                        {emp.status}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenModal('view', emp)}
                          title="View Profile Details"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#6338DF] hover:bg-purple-50 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenModal('edit', emp)}
                          title="Edit Employee"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#6338DF] hover:bg-purple-50 transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      title="No employees found"
                      description="Try adjusting your search criteria or resetting filters."
                      action={
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => { setSearchTerm(''); setDepartmentFilter('All'); setStatusFilter('All'); }}
                        >
                          Clear Filters
                        </Button>
                      }
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Table Pagination Footer */}
        <div className="px-4 sm:px-6 py-3.5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div>
            Showing <span className="font-semibold text-gray-800">{filteredEmployees.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-semibold text-gray-800">
              {Math.min(currentPage * itemsPerPage, filteredEmployees.length)}
            </span>{' '}
            of <span className="font-semibold text-gray-800">{filteredEmployees.length}</span> employees
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </Card>

      {/* 5. Employee Modal (View / Edit / Add) */}
      <Modal
        isOpen={modalMode !== null}
        onClose={handleCloseModal}
        title={
          modalMode === 'add'
            ? 'Add New Employee'
            : modalMode === 'edit'
            ? `Edit Employee: ${selectedEmployee?.name}`
            : `Employee Profile: ${selectedEmployee?.name}`
        }
        subtitle="Manage employee attributes and department assignment"
        badge={modalMode === 'view' ? selectedEmployee?.id : 'Day 3 UI'}
        footer={
          modalMode === 'view' ? (
            <Button variant="outline" size="sm" onClick={handleCloseModal}>
              Close
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveEmployee}>
                {modalMode === 'add' ? 'Create Employee' : 'Save Changes'}
              </Button>
            </>
          )
        }
      >
        {modalMode === 'view' && selectedEmployee ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-purple-50/50 border border-purple-100">
              <div className="w-14 h-14 rounded-2xl bg-[#6338DF] text-white flex items-center justify-center font-bold text-xl shadow-md">
                {selectedEmployee.name.charAt(0)}
              </div>
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
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Employee ID"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                required
              />
              <Input
                label="Full Name"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  className="w-full py-2.5 px-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6338DF]"
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
                label="Designation"
                placeholder="e.g. Frontend Engineer"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                required
              />
            </div>

            <Input
              label="Work Email"
              type="email"
              placeholder="e.g. name@pjntech.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Employment Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Employee['status'] })}
                className="w-full py-2.5 px-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6338DF]"
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
