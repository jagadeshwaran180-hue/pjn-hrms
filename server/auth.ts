import type { UserSession, UserRole } from './types.ts';

export const SYSTEM_ACCOUNTS: Record<string, Omit<UserSession, 'email'>> = {
  'admin@pjntech.com': {
    id: 'EMP-ADM',
    name: 'Admin User',
    role: 'ADMIN',
    department: 'Executive / HR',
    designation: 'System & HR Administrator',
  },
  'hr@pjntech.com': {
    id: 'EMP-005',
    name: 'Arun Kumar',
    role: 'HR',
    department: 'Human Resources',
    designation: 'Senior HR Manager',
  },
  'arun@pjntech.com': {
    id: 'EMP-005',
    name: 'Arun Kumar',
    role: 'HR',
    department: 'Human Resources',
    designation: 'Senior HR Manager',
  },
  'imran@pjntech.com': {
    id: 'EMP-002',
    name: 'Imran M',
    role: 'MANAGER',
    department: 'Engineering',
    designation: 'Engineering Project Lead',
    managedTeam: ['EMP-001', 'EMP-003', 'EMP-006', 'EMP-010'],
  },
  'jagadeesh@pjntech.com': {
    id: 'EMP-001',
    name: 'Jagadeesh K',
    role: 'EMPLOYEE',
    department: 'Engineering',
    designation: 'Frontend Lead',
  },
  'karthick@pjntech.com': {
    id: 'EMP-003',
    name: 'Karthick R',
    role: 'EMPLOYEE',
    department: 'Mobile Apps',
    designation: 'React Native Dev',
  },
  'priya@pjntech.com': {
    id: 'EMP-006',
    name: 'Priya S',
    role: 'EMPLOYEE',
    department: 'Quality Assurance',
    designation: 'QA Engineer',
  },
  'rahul@pjntech.com': {
    id: 'EMP-007',
    name: 'Rahul M',
    role: 'EMPLOYEE',
    department: 'DevOps & Cloud',
    designation: 'DevOps Engineer',
  },
};

/**
 * Resolves user identity from email or ID.
 * Rejects untrusted client roles: identity and role are strictly resolved from canonical registry.
 */
export function resolveUserSession(identity: string): UserSession | null {
  if (!identity || !identity.trim()) return null;

  const normalized = identity.trim().toLowerCase();

  // 1. Direct email lookup
  if (SYSTEM_ACCOUNTS[normalized]) {
    return {
      ...SYSTEM_ACCOUNTS[normalized],
      email: normalized,
    };
  }

  // 2. ID lookup (e.g. 'EMP-002', 'EMP-ADM')
  const entryByEmpId = Object.entries(SYSTEM_ACCOUNTS).find(
    ([, acc]) => acc.id.toLowerCase() === normalized
  );
  if (entryByEmpId) {
    return {
      ...entryByEmpId[1],
      email: entryByEmpId[0],
    };
  }

  // 3. Fallback for @pjntech.com domain: force EMPLOYEE role
  if (normalized.endsWith('@pjntech.com') || normalized.startsWith('emp-')) {
    const rawId = normalized.startsWith('emp-')
      ? normalized.toUpperCase()
      : `EMP-999`;

    return {
      id: rawId,
      name: normalized.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email: normalized.includes('@') ? normalized : `${normalized}@pjntech.com`,
      role: 'EMPLOYEE',
      department: 'General Staff',
      designation: 'Team Member',
    };
  }

  return null;
}

/**
 * Server guard: Checks whether a user has authority to approve a request.
 * - Self-approval is strictly forbidden.
 * - Employees cannot approve.
 * - Managers can only approve requests of their assigned team.
 * - Admin and HR have global approval rights.
 */
export function validateApprovalAuthority(
  session: UserSession | null,
  recordOwnerEmpId: string
): { allowed: boolean; status: number; reason?: string } {
  if (!session) {
    return { allowed: false, status: 401, reason: 'Unauthenticated. Valid session required.' };
  }

  // Rule 1: Self-approval is strictly forbidden across ALL roles
  if (session.id === recordOwnerEmpId) {
    return {
      allowed: false,
      status: 403,
      reason: 'Self-approval is forbidden. A higher authority must process your request.',
    };
  }

  // Rule 2: Admin and HR can approve any organization request
  if (session.role === 'ADMIN' || session.role === 'HR') {
    return { allowed: true, status: 200 };
  }

  // Rule 3: Managers can only approve requests of their assigned team members
  if (session.role === 'MANAGER') {
    if (session.managedTeam && session.managedTeam.includes(recordOwnerEmpId)) {
      return { allowed: true, status: 200 };
    }
    return {
      allowed: false,
      status: 403,
      reason: `Manager authorization error: Employee (${recordOwnerEmpId}) is not in your assigned team.`,
    };
  }

  // Rule 4: Employee cannot approve any requests
  return {
    allowed: false,
    status: 403,
    reason: 'Access Denied: Employees do not possess approval permissions.',
  };
}

/**
 * Server guard: Checks whether a user has permission to read a record.
 * Employees cannot view other employees' private records.
 */
export function validateRecordAccess(
  session: UserSession | null,
  recordOwnerEmpId: string
): { allowed: boolean; status: number; reason?: string } {
  if (!session) {
    return { allowed: false, status: 401, reason: 'Unauthenticated.' };
  }

  if (session.role === 'ADMIN' || session.role === 'HR') {
    return { allowed: true, status: 200 };
  }

  if (session.id === recordOwnerEmpId) {
    return { allowed: true, status: 200 };
  }

  if (session.role === 'MANAGER' && session.managedTeam?.includes(recordOwnerEmpId)) {
    return { allowed: true, status: 200 };
  }

  return {
    allowed: false,
    status: 403,
    reason: `Forbidden: You do not have permission to access records for employee ${recordOwnerEmpId}.`,
  };
}
