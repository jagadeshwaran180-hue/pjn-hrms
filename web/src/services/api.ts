/**
 * ============================================================================
 * PJN TECH HRMS - UNIFIED CLIENT API SERVICE
 * ============================================================================
 * Connects the web frontend directly to backend REST endpoints.
 * Automatically injects authenticated identity tokens, manages optimistic
 * concurrency / version checks, handles network errors, and ensures UI
 * decisions are permanently persisted in the server database.
 * ============================================================================
 */

import { getActiveSession } from './authService';

export interface ApiErrorResponse {
  error: string;
  latest?: any;
}

export class ApiError extends Error {
  status: number;
  latest?: any;

  constructor(status: number, message: string, latest?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.latest = latest;
  }
}

/**
 * Core fetch wrapper with session token injection and error handling.
 */
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const session = getActiveSession();
  const headers = new Headers(options.headers || {});

  headers.set('Content-Type', 'application/json');
  if (session?.email) {
    headers.set('Authorization', `Bearer ${session.email}`);
    headers.set('X-User-Id', session.id);
  }

  let response: Response;
  try {
    response = await fetch(endpoint, {
      ...options,
      headers,
    });
  } catch (_err: any) {
    throw new ApiError(
      0,
      'Network Connection Failure: Unable to reach the HRMS backend. Please check your connection and retry.'
    );
  }

  let data: any = {};
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = {};
    }
  }

  if (!response.ok) {
    const errorMsg = data.error || `HTTP ${response.status}: Request failed`;
    throw new ApiError(response.status, errorMsg, data.latest);
  }

  return data as T;
}

// --- LEAVES API ---
export async function getLeaves() {
  const res = await apiFetch<{ leaves: any[] }>('/api/leaves');
  return res.leaves;
}

export async function createLeave(payload: {
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
}) {
  const res = await apiFetch<{ success: boolean; leave: any }>('/api/leaves', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.leave;
}

export async function decideLeave(
  id: string,
  decision: 'Approved' | 'Rejected',
  reason?: string,
  expectedVersion?: number
) {
  const res = await apiFetch<{ success: boolean; leave: any }>(
    `/api/leaves/${encodeURIComponent(id)}/decision`,
    {
      method: 'PATCH',
      body: JSON.stringify({ decision, reason, expectedVersion }),
    }
  );
  return res.leave;
}

// --- HYBRID WORK API ---
export async function getHybridRequests() {
  const res = await apiFetch<{ requests: any[] }>('/api/hybrid-requests');
  return res.requests;
}

export async function createHybridRequest(payload: {
  startDate: string;
  endDate: string;
  reason: string;
}) {
  const res = await apiFetch<{ success: boolean; request: any }>('/api/hybrid-requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.request;
}

export async function decideHybridRequest(
  id: string,
  action: 'approve' | 'reject' | 'revoke' | 'edit',
  payload: {
    validUntil?: string;
    reason?: string;
    status?: string;
    expectedVersion?: number;
  } = {}
) {
  const res = await apiFetch<{ success: boolean; request: any }>(
    `/api/hybrid-requests/${encodeURIComponent(id)}/decision`,
    {
      method: 'PATCH',
      body: JSON.stringify({ action, ...payload }),
    }
  );
  return res.request;
}

// --- ATTENDANCE REGULARIZATION API ---
export async function getRegularizationRequests() {
  const res = await apiFetch<{ requests: any[] }>('/api/regularization-requests');
  return res.requests;
}

export async function createRegularizationRequest(payload: {
  date: string;
  originalPunch: string;
  requestedPunch: string;
  type: string;
  reason: string;
}) {
  const res = await apiFetch<{ success: boolean; request: any }>('/api/regularization-requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.request;
}

export async function decideRegularizationRequest(
  id: string,
  decision: 'Approved' | 'Rejected',
  reason?: string,
  expectedVersion?: number
) {
  const res = await apiFetch<{ success: boolean; request: any }>(
    `/api/regularization-requests/${encodeURIComponent(id)}/decision`,
    {
      method: 'PATCH',
      body: JSON.stringify({ decision, reason, expectedVersion }),
    }
  );
  return res.request;
}

// --- ATTENDANCE LOGS & GPS PUNCH API ---
export async function getAttendanceLogs() {
  const res = await apiFetch<{ logs: any[] }>('/api/attendance');
  return res.logs;
}

export async function punchAttendance(action?: 'in' | 'out', distanceMeters?: number) {
  const res = await apiFetch<{ success: boolean; log: any; message: string }>('/api/attendance/punch', {
    method: 'POST',
    body: JSON.stringify({ action, distanceMeters }),
  });
  return res;
}

// --- EMPLOYEES API ---
export async function getEmployees() {
  const res = await apiFetch<{ employees: any[] }>('/api/employees');
  return res.employees;
}

export async function createEmployee(payload: any) {
  const res = await apiFetch<{ success: boolean; employee: any }>('/api/employees', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.employee;
}

export async function updateEmployee(id: string, payload: any) {
  const res = await apiFetch<{ success: boolean; employee: any }>(`/api/employees/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return res.employee;
}

// --- BRANCHES API ---
export async function getBranches() {
  const res = await apiFetch<{ branches: any[] }>('/api/branches');
  return res.branches;
}

export async function createBranch(payload: any) {
  const res = await apiFetch<{ success: boolean; branch: any }>('/api/branches', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.branch;
}

// --- SHIFTS API ---
export async function getShifts() {
  const res = await apiFetch<{ shifts: any[] }>('/api/shifts');
  return res.shifts;
}

export async function createShift(payload: any) {
  const res = await apiFetch<{ success: boolean; shift: any }>('/api/shifts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.shift;
}

export async function updateShift(id: string, payload: any) {
  const res = await apiFetch<{ success: boolean; shift: any }>(`/api/shifts/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return res.shift;
}

// --- HOLIDAYS API ---
export async function getHolidays() {
  const res = await apiFetch<{ holidays: any[] }>('/api/holidays');
  return res.holidays;
}

export async function createHoliday(payload: any) {
  const res = await apiFetch<{ success: boolean; holiday: any }>('/api/holidays', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.holiday;
}

// --- AUDIT LOGS API ---
export async function getAuditLogs() {
  const res = await apiFetch<{ auditLogs: any[] }>('/api/audit-logs');
  return res.auditLogs;
}

// --- SETTINGS API ---
export async function getSettings() {
  const res = await apiFetch<{ settings: any }>('/api/settings');
  return res.settings;
}

export async function updateSettings(settings: any) {
  const res = await apiFetch<{ success: boolean; settings: any }>('/api/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
  return res.settings;
}

// --- DASHBOARD STATS API ---
export async function getDashboardStats() {
  return await apiFetch<any>('/api/dashboard/stats');
}

/**
 * Universal CSV Exporter utility: Creates and triggers a real download of CSV data.
 */
export function downloadCSV(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
