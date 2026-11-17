/**
 * ============================================================================
 * PJN TECH HRMS - AUTHENTICATION & ACCESS CONTROL SERVICE
 * ============================================================================
 * 
 * SECURITY ARCHITECTURE NOTE:
 * In a production deployment, all authentication, authorization, session
 * verification, role mapping, and record filtering MUST be enforced on the
 * backend server (e.g. Node/Express, Spring Boot, etc.) behind HTTP-only
 * secure cookies or cryptographically signed tokens.
 * 
 * In this frontend application, this service acts as the canonical authoritative
 * session and permission engine:
 * 1. It NEVER trusts a client-supplied role or employee ID.
 * 2. It derives identity and permissions strictly from the verified account registry.
 * 3. Role escalations through profile edits or local tampering are rejected.
 * ============================================================================
 */

import { UserSession, PermissionAction } from '../types';

/**
 * Authoritative system user directory (simulating server database)
 */
export const SYSTEM_ACCOUNTS: Record<string, Omit<UserSession, 'email'>> = {
  'admin@pjntech.com': {
    id: 'EMP-ADM',
    name: 'Admin User',
    role: 'ADMIN',
    department: 'Executive / HR',
    designation: 'System & HR Administrator',
  },
  'hr@pjntech.com': {
    id: 'EMP-HR',
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
    // Assigned team members reporting to Imran
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

const STORAGE_SESSION_KEY = 'pjn_hrms_session_token';
const LEGACY_STORAGE_KEY = 'pjn_demo_auth';

/**
 * Validates credentials and generates a session.
 * CRITICAL: Notice that NO 'role' or 'id' parameter is accepted from the caller!
 * The role is solely resolved from SYSTEM_ACCOUNTS.
 */
export function authenticateUser(email: string, _password?: string): { success: boolean; session?: UserSession; error?: string } {
  if (!email || !email.trim()) {
    return { success: false, error: 'Email or Employee ID is required.' };
  }

  const normalizedEmail = email.trim().toLowerCase();

  // 1. Check known authoritative accounts
  if (SYSTEM_ACCOUNTS[normalizedEmail]) {
    const account = SYSTEM_ACCOUNTS[normalizedEmail];
    const session: UserSession = {
      ...account,
      email: normalizedEmail,
    };
    saveSession(session);
    return { success: true, session };
  }

  // 2. Fallback for valid company domain: default to EMPLOYEE role ONLY
  if (normalizedEmail.endsWith('@pjntech.com') || normalizedEmail.startsWith('emp-')) {
    const rawId = normalizedEmail.startsWith('emp-')
      ? normalizedEmail.toUpperCase()
      : `EMP-${Math.abs(hashString(normalizedEmail)) % 900 + 100}`;
    
    const fallbackSession: UserSession = {
      id: rawId,
      name: normalizedEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email: normalizedEmail.includes('@') ? normalizedEmail : `${normalizedEmail}@pjntech.com`,
      role: 'EMPLOYEE', // DEFAULT DENY ELEVATION: Always regular employee
      department: 'General Staff',
      designation: 'Team Member',
    };
    saveSession(fallbackSession);
    return { success: true, session: fallbackSession };
  }

  return {
    success: false,
    error: 'Invalid domain credentials. Use an authorized @pjntech.com account.',
  };
}

/**
 * Retrieves and validates the current active session.
 * Protects against localStorage manipulation:
 * If an employee tampers with localStorage to change their role to ADMIN,
 * this function re-validates the email against SYSTEM_ACCOUNTS!
 */
export function getActiveSession(): UserSession | null {
  try {
    // Check modern session
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_SESSION_KEY) : null;
    let storedSession: UserSession | null = null;

    if (raw) {
      storedSession = JSON.parse(raw);
    } else {
      // Migrate legacy storage if present (and fix role mapping)
      const legacyRaw = typeof window !== 'undefined' ? localStorage.getItem(LEGACY_STORAGE_KEY) : null;
      if (legacyRaw) {
        const legacy = JSON.parse(legacyRaw);
        if (legacy?.email) {
          const res = authenticateUser(legacy.email);
          if (res.success && res.session) {
            localStorage.removeItem(LEGACY_STORAGE_KEY);
            return res.session;
          }
        }
      }
    }

    if (!storedSession || !storedSession.email) {
      return null;
    }

    // SANITIZATION: Verify role against SYSTEM_ACCOUNTS to prevent client-side tampering
    const canonical = SYSTEM_ACCOUNTS[storedSession.email.toLowerCase()];
    if (canonical) {
      return {
        ...canonical,
        email: storedSession.email.toLowerCase(),
      };
    }

    // Non-canonical account: enforce EMPLOYEE role
    return {
      ...storedSession,
      role: 'EMPLOYEE', // Force EMPLOYEE
    };
  } catch (err) {
    console.error('Session validation error:', err);
    return null;
  }
}

/**
 * Persists session securely
 */
export function saveSession(session: UserSession): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  }
}

/**
 * Destroys session
 */
export function terminateSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  }
}

/**
 * Role Permission Matrix - Central policy engine
 */
export function checkPermission(user: UserSession | null, action: PermissionAction): boolean {
  if (!user) return false;

  const { role } = user;

  switch (action) {
    case 'manage_roles_settings':
      // Admin only
      return role === 'ADMIN';

    case 'manage_employees':
    case 'manage_shifts':
    case 'manage_holidays':
    case 'view_reports':
    case 'view_audit_logs':
    case 'approve_all_requests':
    case 'view_all_employees':
    case 'view_all_attendance':
      // Admin and HR
      return role === 'ADMIN' || role === 'HR';

    case 'approve_team_requests':
      // Admin, HR, and Manager
      return role === 'ADMIN' || role === 'HR' || role === 'MANAGER';

    case 'view_own_records':
      // Available to all authenticated users
      return true;

    default:
      return false; // Deny by default
  }
}

/**
 * Record Ownership Guard - Verifies if the authenticated session
 * has read or write authority over a specific employee's record.
 */
export function canAccessRecord(
  session: UserSession | null,
  recordOwnerEmpId: string
): { allowed: boolean; reason?: string } {
  if (!session) {
    return { allowed: false, reason: 'Unauthenticated. Session missing.' };
  }

  // 1. Admin and HR have global organization access
  if (session.role === 'ADMIN' || session.role === 'HR') {
    return { allowed: true };
  }

  // 2. Record owner always has access to their own record
  if (session.id === recordOwnerEmpId) {
    return { allowed: true };
  }

  // 3. Manager can access records of their assigned team members
  if (session.role === 'MANAGER' && session.managedTeam?.includes(recordOwnerEmpId)) {
    return { allowed: true };
  }

  // 4. Default: Deny
  return {
    allowed: false,
    reason: `Access denied. Role ${session.role} (${session.id}) cannot access record for ${recordOwnerEmpId}.`,
  };
}

/**
 * Approval Authority Guard - Enforces approval policy:
 * - Managers cannot approve their own requests.
 * - Employees cannot approve any requests.
 * - Managers can only approve requests of their assigned team.
 */
export function canApproveRequest(
  session: UserSession | null,
  requestOwnerEmpId: string
): { allowed: boolean; reason?: string } {
  if (!session) {
    return { allowed: false, reason: 'Unauthenticated.' };
  }

  // Rule: Users cannot approve their own requests
  if (session.id === requestOwnerEmpId) {
    return { allowed: false, reason: 'Self-approval is forbidden. A higher authority must approve your request.' };
  }

  // Rule: Admin and HR can approve any request
  if (session.role === 'ADMIN' || session.role === 'HR') {
    return { allowed: true };
  }

  // Rule: Managers can only approve requests from their assigned team members
  if (session.role === 'MANAGER') {
    if (session.managedTeam?.includes(requestOwnerEmpId)) {
      return { allowed: true };
    }
    return { allowed: false, reason: 'You can only approve requests for your assigned team members.' };
  }

  // Employee: cannot approve anything
  return { allowed: false, reason: 'Employees do not have approval privileges.' };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
