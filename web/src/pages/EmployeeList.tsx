import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  UserPlus,
  Eye,
  Edit2,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle
} from 'lucide-react';
import { mockEmployees } from '../data/mockData';
import { Employee } from '../types';

export const EmployeeList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Selected employee for mock modal
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add' | null>(null);

  // Departments list
  const departments = useMemo(() => {
    return ['All', ...Array.from(new Set(mockEmployees.map((e) => e.department)))];
  }, []);

  // Filtered list
  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;
      const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [searchTerm, departmentFilter, statusFilter]);

  // Paginated records
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1;
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(start, start + itemsPerPage);
  }, [filteredEmployees, currentPage]);

  const handleOpenModal = (mode: 'view' | 'edit' | 'add', emp?: Employee) => {
    setModalMode(mode);
    setSelectedEmployee(emp || null);
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedEmployee(null);
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

        <button
          onClick={() => handleOpenModal('add')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#6338DF] hover:bg-[#5229cb] text-white font-semibold text-sm shadow-sm transition-all focus:ring-2 focus:ring-[#6338DF] focus:ring-offset-2"
        >
          <UserPlus size={16} />
          <span>Add Employee</span>
        </button>
      </div>

      {/* 2. Search & Filters Bar */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Search by employee name, ID, designation, or email..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6338DF] transition-all"
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
              className="text-xs text-[#6338DF] hover:underline px-2 py-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* 3. Table Container */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
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
                    {/* Employee ID */}
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-xs font-semibold text-[#6338DF]">
                      {emp.id}
                    </td>

                    {/* Name */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-[#6338DF] font-bold text-xs flex items-center justify-center shrink-0">
                          {emp.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-gray-900">{emp.name}</span>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4 sm:px-6 text-gray-600 font-medium">
                      {emp.department}
                    </td>

                    {/* Designation */}
                    <td className="py-3.5 px-4 sm:px-6 text-gray-600">
                      {emp.designation}
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 sm:px-6 text-gray-500 font-mono text-xs">
                      {emp.email}
                    </td>

                    {/* Status badge */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          emp.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : emp.status === 'On Leave'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenModal('view', emp)}
                          title="View Details"
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
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    <div className="max-w-sm mx-auto flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                        <AlertCircle size={24} />
                      </div>
                      <p className="font-semibold text-gray-800 text-sm">No employees found</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Try adjusting your search criteria or resetting filters.
                      </p>
                    </div>
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
      </div>

      {/* 5. UI-Only Placeholder Modal (Per handoff requirement) */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {modalMode === 'add' && 'Add New Employee'}
                  {modalMode === 'edit' && `Edit Profile: ${selectedEmployee?.name}`}
                  {modalMode === 'view' && `Profile Overview: ${selectedEmployee?.name}`}
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-50 text-[#6338DF] border border-purple-100">
                  UI Mock Modal • Day 1 Deliverable
                </span>
              </div>
              <button onClick={handleCloseModal} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            {selectedEmployee ? (
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs font-medium text-gray-400">Employee ID</span>
                  <p className="font-semibold text-gray-900">{selectedEmployee.id}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-400">Department & Designation</span>
                  <p className="font-semibold text-gray-900">{selectedEmployee.department} — {selectedEmployee.designation}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-400">Work Email</span>
                  <p className="font-mono text-xs text-gray-700">{selectedEmployee.email}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-400">Status</span>
                  <p className="font-semibold text-gray-900">{selectedEmployee.status}</p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-500 py-4">
                <p>Full employee creation form will be integrated on <strong>Day 3 (18 Nov)</strong> with Spring Boot backend APIs.</p>
              </div>
            )}

            <div className="mt-6 pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-[#6338DF] hover:bg-[#5229cb] text-white text-xs font-semibold rounded-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
