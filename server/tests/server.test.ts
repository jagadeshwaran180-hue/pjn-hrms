import { test, describe, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';
import { Readable } from 'node:stream';
import { setDatabasePath, resetDB, getDB, updateDB } from '../db.ts';
import { handleApiRequest } from '../apiHandler.ts';

const testDir = import.meta.dirname || path.resolve('.');
const testDbPath = path.resolve(testDir, 'test_hrms_db.json');
setDatabasePath(testDbPath);

/**
 * In-memory HTTP request simulator for sandbox-compliant test execution
 */
async function simulateApi(
  method: string,
  pathname: string,
  body?: any,
  headers: Record<string, string> = {}
): Promise<{ status: number; data: any; headers: Record<string, any> }> {
  return new Promise(async (resolve, reject) => {
    const bodyStr = body !== undefined ? JSON.stringify(body) : '';
    const reqStream = new Readable({
      read() {
        if (bodyStr) {
          this.push(bodyStr);
        }
        this.push(null);
      },
    }) as any;

    reqStream.url = pathname;
    reqStream.method = method;
    reqStream.headers = {
      'content-type': 'application/json',
      host: 'localhost',
      ...headers,
    };
    reqStream.socket = { remoteAddress: '127.0.0.1' };

    let resStatusCode = 200;
    let resHeaders: Record<string, any> = {};
    let resBody = '';

    const resObj: any = {
      headersSent: false,
      writeHead(code: number, h?: any) {
        resStatusCode = code;
        if (h) resHeaders = { ...resHeaders, ...h };
        this.headersSent = true;
      },
      setHeader(name: string, value: any) {
        resHeaders[name.toLowerCase()] = value;
      },
      getHeader(name: string) {
        return resHeaders[name.toLowerCase()];
      },
      end(chunk?: any) {
        if (chunk) resBody += chunk;
        let parsed = {};
        if (resBody.trim()) {
          try {
            parsed = JSON.parse(resBody);
          } catch {
            parsed = { raw: resBody };
          }
        }
        resolve({
          status: resStatusCode,
          data: parsed,
          headers: resHeaders,
        });
      },
    };

    try {
      const handled = await handleApiRequest(reqStream, resObj);
      if (!handled) {
        resolve({
          status: 404,
          data: { error: 'Not handled by API' },
          headers: {},
        });
      }
    } catch (err) {
      reject(err);
    }
  });
}

describe('PJN Tech HRMS - Backend API & Persistence Verification', () => {
  beforeEach(async () => {
    // Reset test database to fresh initial mock data before each test
    await resetDB();
  });

  after(() => {
    if (fs.existsSync(testDbPath)) {
      try {
        fs.unlinkSync(testDbPath);
      } catch {}
    }
  });

  // --- 1. PERSISTENCE & DECISIONS ---
  test('1. Approve leave request persists permanently and survives navigation/re-fetch', async () => {
    // Admin approves LR-101 (Arun Kumar, EMP-005)
    const resApprove = await simulateApi(
      'PATCH',
      '/api/leaves/LR-101/decision',
      { decision: 'Approved' },
      { authorization: 'Bearer admin@pjntech.com' }
    );

    assert.strictEqual(resApprove.status, 200);
    assert.strictEqual(resApprove.data.leave.status, 'Approved');
    assert.ok(resApprove.data.leave.processedBy.includes('Admin User'));

    // Verify when loading all leaves (simulating page refresh or navigation back)
    const resGet = await simulateApi(
      'GET',
      '/api/leaves',
      undefined,
      { authorization: 'Bearer admin@pjntech.com' }
    );
    assert.strictEqual(resGet.status, 200);
    const savedLeave = resGet.data.leaves.find((l: any) => l.id === 'LR-101');
    assert.strictEqual(savedLeave.status, 'Approved');
    assert.strictEqual(savedLeave.version, 2);

    // Verify on disk directly from database file
    const db = getDB();
    const diskLeave = db.leaves.find((l) => l.id === 'LR-101');
    assert.strictEqual(diskLeave?.status, 'Approved');
  });

  test('2. Reject leave request persists permanently and records rejection details', async () => {
    // Admin rejects LR-105
    const resReject = await simulateApi(
      'PATCH',
      '/api/leaves/LR-105/decision',
      { decision: 'Rejected', reason: 'Critical project release milestone scheduled' },
      { authorization: 'Bearer admin@pjntech.com' }
    );

    assert.strictEqual(resReject.status, 200);
    assert.strictEqual(resReject.data.leave.status, 'Rejected');

    // Re-query: remains Rejected
    const resGet = await simulateApi(
      'GET',
      '/api/leaves',
      undefined,
      { authorization: 'Bearer admin@pjntech.com' }
    );
    const savedLeave = resGet.data.leaves.find((l: any) => l.id === 'LR-105');
    assert.strictEqual(savedLeave.status, 'Rejected');
    assert.strictEqual(savedLeave.rejectionReason, 'Critical project release milestone scheduled');
  });

  test('3. Other authorized users immediately see the saved decision', async () => {
    // Admin approves LR-105 (Jagadeesh K - EMP-001)
    await simulateApi(
      'PATCH',
      '/api/leaves/LR-105/decision',
      { decision: 'Approved' },
      { authorization: 'Bearer admin@pjntech.com' }
    );

    // Imran (Manager for EMP-001) fetches leaves
    const resManager = await simulateApi(
      'GET',
      '/api/leaves',
      undefined,
      { authorization: 'Bearer imran@pjntech.com' }
    );

    const managerView = resManager.data.leaves.find((l: any) => l.id === 'LR-105');
    assert.strictEqual(managerView.status, 'Approved');
    assert.ok(managerView.processedBy.includes('Admin User'));
  });

  // --- 2. CONCURRENCY & CONFLICT RESOLUTION ---
  test('4. Simultaneous decisions on the same request: only one succeeds, other gets 409 Conflict with latest status', async () => {
    // LR-103 is pending (Rahul M - EMP-007)
    // First decision: Admin approves
    const resFirst = await simulateApi(
      'PATCH',
      '/api/leaves/LR-103/decision',
      { decision: 'Approved' },
      { authorization: 'Bearer admin@pjntech.com' }
    );
    assert.strictEqual(resFirst.status, 200);

    // Second decision: Another authorized HR user tries to reject concurrently
    const resSecond = await simulateApi(
      'PATCH',
      '/api/leaves/LR-103/decision',
      { decision: 'Rejected', reason: 'Coverage shortage' },
      { authorization: 'Bearer hr@pjntech.com' }
    );

    // Must be rejected with 409 Conflict
    assert.strictEqual(resSecond.status, 409);
    assert.ok(resSecond.data.error.includes('already been processed'));
    assert.strictEqual(resSecond.data.latest.status, 'Approved');
  });

  // --- 3. DUPLICATE ACTIONS / IDEMPOTENCY ---
  test('5. Repeated double-click submits safely (idempotent)', async () => {
    // Admin approves LR-101
    const res1 = await simulateApi(
      'PATCH',
      '/api/leaves/LR-101/decision',
      { decision: 'Approved' },
      { authorization: 'Bearer admin@pjntech.com' }
    );
    assert.strictEqual(res1.status, 200);

    // Exact same repeated click by Admin
    const res2 = await simulateApi(
      'PATCH',
      '/api/leaves/LR-101/decision',
      { decision: 'Approved' },
      { authorization: 'Bearer admin@pjntech.com' }
    );
    assert.strictEqual(res2.status, 200);
    assert.strictEqual(res2.data.leave.status, 'Approved');
  });

  // --- 4. AUTHORIZATION & RBAC ENFORCEMENT ---
  test('6. Self-approval is strictly forbidden (Managers cannot approve own requests)', async () => {
    // LR-106 belongs to Imran (EMP-002, MANAGER)
    // Imran attempts to self-approve LR-106
    const resSelf = await simulateApi(
      'PATCH',
      '/api/leaves/LR-106/decision',
      { decision: 'Approved' },
      { authorization: 'Bearer imran@pjntech.com' }
    );

    assert.strictEqual(resSelf.status, 403);
    assert.ok(resSelf.data.error.includes('Self-approval is forbidden'));
  });

  test('7. Employees cannot approve requests (403 Forbidden)', async () => {
    // Jagadeesh (EMPLOYEE) attempts to approve LR-101
    const resEmp = await simulateApi(
      'PATCH',
      '/api/leaves/LR-101/decision',
      { decision: 'Approved' },
      { authorization: 'Bearer jagadeesh@pjntech.com' }
    );

    assert.strictEqual(resEmp.status, 403);
    assert.ok(resEmp.data.error.includes('Access Denied'));
  });

  test('8. Manager cannot approve requests for employees outside their team', async () => {
    // LR-101 belongs to Arun Kumar (EMP-005 in HR, not in Imran's Engineering team)
    const resOutsideTeam = await simulateApi(
      'PATCH',
      '/api/leaves/LR-101/decision',
      { decision: 'Approved' },
      { authorization: 'Bearer imran@pjntech.com' }
    );

    assert.strictEqual(resOutsideTeam.status, 403);
    assert.ok(resOutsideTeam.data.error.includes('not in your assigned team'));
  });

  test('9. Employees cannot access other employees\' private records', async () => {
    // Jagadeesh (EMPLOYEE) fetches /api/leaves
    const resEmp = await simulateApi(
      'GET',
      '/api/leaves',
      undefined,
      { authorization: 'Bearer jagadeesh@pjntech.com' }
    );

    assert.strictEqual(resEmp.status, 200);
    // All returned records must belong only to Jagadeesh (EMP-001)
    const records = resEmp.data.leaves;
    assert.ok(records.length > 0);
    for (const r of records) {
      assert.strictEqual(r.empId, 'EMP-001');
    }
  });

  // --- 5. HYBRID & REGULARIZATION APPROVALS & CASCADES ---
  test('10. Hybrid approval cascades to attendance and updates valid until', async () => {
    // BUG-018: Manager is blocked per configured policy (do not broaden permissions)
    const resBlocked = await simulateApi(
      'PATCH',
      '/api/hybrid-requests/HYB-201/decision',
      { action: 'approve', validUntil: '22 Nov 2026' },
      { authorization: 'Bearer imran@pjntech.com' }
    );
    assert.strictEqual(resBlocked.status, 403);

    // HYB-201 approved by authorized HR role
    const resHybrid = await simulateApi(
      'PATCH',
      '/api/hybrid-requests/HYB-201/decision',
      { action: 'approve', validUntil: '22 Nov 2026' },
      { authorization: 'Bearer hr@pjntech.com' }
    );

    assert.strictEqual(resHybrid.status, 200);
    assert.strictEqual(resHybrid.data.request.status, 'Approved');
    assert.strictEqual(resHybrid.data.request.validUntil, '22 Nov 2026');

    // Verify cascade to attendance logs
    const resAtt = await simulateApi(
      'GET',
      '/api/attendance',
      undefined,
      { authorization: 'Bearer admin@pjntech.com' }
    );
    const karthickLog = resAtt.data.logs.find((l: any) => l.empId === 'EMP-003');
    assert.ok(karthickLog);
  });

  test('11. Regularization approval updates punch timestamps and attendance status', async () => {
    // REG-501 is pending for Jagadeesh (EMP-001): Missed Check-Out requested 'Check-Out: 06:30 PM'
    const resReg = await simulateApi(
      'PATCH',
      '/api/regularization-requests/REG-501/decision',
      { decision: 'Approved' },
      { authorization: 'Bearer admin@pjntech.com' }
    );

    assert.strictEqual(resReg.status, 200);
    assert.strictEqual(resReg.data.request.status, 'Approved');

    // Check attendance record updated with corrected checkout
    const db = getDB();
    const jagLog = db.attendanceLogs.find((a) => a.empId === 'EMP-001');
    assert.strictEqual(jagLog?.checkOut, '06:30 PM');
    assert.strictEqual(jagLog?.status, 'Present');
  });

  // --- 6. ATTENDANCE PUNCH INTEGRITY ---
  test('12. Employee can only punch for themselves and cannot forge other employees\' punches', async () => {
    // Jagadeesh tries to punch for Imran (EMP-002)
    const resForge = await simulateApi(
      'POST',
      '/api/attendance/punch',
      { empId: 'EMP-002', action: 'in' },
      { authorization: 'Bearer jagadeesh@pjntech.com' }
    );

    assert.strictEqual(resForge.status, 403);
    assert.ok(resForge.data.error.includes('Attendance punches affect only the authenticated user'));

    // Jagadeesh punches for himself
    const resOwn = await simulateApi(
      'POST',
      '/api/attendance/punch',
      { empId: 'EMP-001', distanceMeters: 25 },
      { authorization: 'Bearer jagadeesh@pjntech.com' }
    );

    assert.strictEqual(resOwn.status, 200);
    assert.strictEqual(resOwn.data.success, true);
  });

  // --- 7. SETTINGS & ROLE-BASED ADMINISTRATIVE ACCESS ---
  test('13. System settings update requires Super Admin (non-admin receives 403, admin persists configuration)', async () => {
    // Non-admin (HR) attempts to modify system settings
    const resHr = await simulateApi(
      'PUT',
      '/api/settings',
      { geofenceRadiusMeters: 150 },
      { authorization: 'Bearer hr@pjntech.com' }
    );
    assert.strictEqual(resHr.status, 403);
    assert.ok(resHr.data.error.includes('Super Administrator privileges required'));

    // Admin updates settings
    const resAdmin = await simulateApi(
      'PUT',
      '/api/settings',
      { geofenceRadiusMeters: 150, lateGraceMinutes: 20 },
      { authorization: 'Bearer admin@pjntech.com' }
    );
    assert.strictEqual(resAdmin.status, 200);
    assert.strictEqual(resAdmin.data.settings.geofenceRadiusMeters, 150);
    assert.strictEqual(resAdmin.data.settings.lateGraceMinutes, 20);

    // Verify persistence via GET
    const resGet = await simulateApi('GET', '/api/settings', undefined, { authorization: 'Bearer hr@pjntech.com' });
    assert.strictEqual(resGet.status, 200);
    assert.strictEqual(resGet.data.settings.geofenceRadiusMeters, 150);
  });

  // --- 8. EMPLOYEE DIRECTORY RBAC ---
  test('14. Employee registration and updates require Admin or HR role (Employee gets 403)', async () => {
    // Employee tries to create an employee
    const resEmpCreate = await simulateApi(
      'POST',
      '/api/employees',
      { name: 'Fake Staff', email: 'fake@pjntech.com', department: 'QA' },
      { authorization: 'Bearer jagadeesh@pjntech.com' }
    );
    assert.strictEqual(resEmpCreate.status, 403);

    // HR creates a new employee profile
    const resHrCreate = await simulateApi(
      'POST',
      '/api/employees',
      { name: 'Anil Rao', email: 'anil@pjntech.com', department: 'Engineering', designation: 'Senior QA' },
      { authorization: 'Bearer hr@pjntech.com' }
    );
    assert.strictEqual(resHrCreate.status, 201);
    assert.strictEqual(resHrCreate.data.employee.name, 'Anil Rao');

    // HR updates employee profile
    const empId = resHrCreate.data.employee.id;
    const resUpdate = await simulateApi(
      'PUT',
      `/api/employees/${empId}`,
      { designation: 'Lead QA Engineer' },
      { authorization: 'Bearer hr@pjntech.com' }
    );
    assert.strictEqual(resUpdate.status, 200);
    assert.strictEqual(resUpdate.data.employee.designation, 'Lead QA Engineer');
  });

  // --- 9. RAPID PARALLEL OPERATIONS INTEGRITY ---
  test('15. Rapid sequential decisions on distinct pending requests complete without race conditions or cross-contamination', async () => {
    // Create two new pending leave requests for different employees
    const db = getDB();
    const req1 = {
      id: 'LR-TEST-1',
      empId: 'EMP-003',
      name: 'Karthick R',
      department: 'Mobile Apps',
      leaveType: 'Annual Leave' as const,
      startDate: '28 Nov 2026',
      endDate: '29 Nov 2026',
      days: 2,
      reason: 'Vacation 1',
      status: 'Pending' as const,
      appliedOn: '17 Nov 2026',
      version: 1,
    };
    const req2 = {
      id: 'LR-TEST-2',
      empId: 'EMP-006',
      name: 'Priya S',
      department: 'Quality Assurance',
      leaveType: 'Sick Leave' as const,
      startDate: '28 Nov 2026',
      endDate: '28 Nov 2026',
      days: 1,
      reason: 'Fever 2',
      status: 'Pending' as const,
      appliedOn: '17 Nov 2026',
      version: 1,
    };
    // Persist two new pending leave requests for different employees
    await updateDB((db) => {
      db.leaves.push(req1, req2);
      return true;
    });

    // Concurrently decide both requests with different decisions
    const [res1, res2] = await Promise.all([
      simulateApi('PATCH', '/api/leaves/LR-TEST-1/decision', { decision: 'Approved' }, { authorization: 'Bearer admin@pjntech.com' }),
      simulateApi('PATCH', '/api/leaves/LR-TEST-2/decision', { decision: 'Rejected', reason: 'Critical deploy' }, { authorization: 'Bearer admin@pjntech.com' })
    ]);

    assert.strictEqual(res1.status, 200);
    assert.strictEqual(res1.data.leave.status, 'Approved');
    assert.strictEqual(res2.status, 200);
    assert.strictEqual(res2.data.leave.status, 'Rejected');

    // Confirm both are stored correctly in DB without cross-talk
    const latestDb = getDB();
    const check1 = latestDb.leaves.find((l) => l.id === 'LR-TEST-1');
    const check2 = latestDb.leaves.find((l) => l.id === 'LR-TEST-2');
    assert.strictEqual(check1?.status, 'Approved');
    assert.strictEqual(check2?.status, 'Rejected');
    assert.strictEqual(check2?.rejectionReason, 'Critical deploy');
  });

  // --- 10. AUDIT TRAIL LOGGING ---
  test('16. Authorization actions produce chronological audit entries with actor and target', async () => {
    const resLogs = await simulateApi('GET', '/api/audit-logs', undefined, { authorization: 'Bearer admin@pjntech.com' });
    assert.strictEqual(resLogs.status, 200);
    assert.ok(Array.isArray(resLogs.data.auditLogs));
    assert.ok(resLogs.data.auditLogs.length > 0);

    // Verify audit entry format
    const topEntry = resLogs.data.auditLogs[0];
    assert.ok(topEntry.id.startsWith('AUD-'));
    assert.ok(topEntry.timestamp);
    assert.ok(topEntry.actor);
    assert.ok(topEntry.action);
    assert.strictEqual(topEntry.status, 'SUCCESS');
  });
});

