# PJN Tech HRMS — Phase 1 Hardening & Handoff Sign-Off (23 Nov Milestone)

**Project Lead & Backend Architect:** Imran  
**Assigned Technical Lead:** TL Keerthan Vijayakumar  
**Team Members:** Jagadeesh, Karthick, Trupthi, Anuvrath, Amrutha, Vishali  
**Deliverable Scope:** Phase 1 Backend Hardening, Multi-Tenant Security, Acceptance Validation & Handoff  

---

## 1. Executive Summary

As of the **23 November Milestone (Phase 1 Backend MVP)**, all deliverables under Imran's ownership as Project Lead and Backend Architect have been **implemented, verified, and locked in**:

| Module | Status | Verification & Evidence |
|---|:---:|---|
| **Spring Boot 3.3.4 & Java 17 Core** | ✅ **COMPLETE** | Production configurations, OpenAPI Swagger UI, Actuator health endpoints active |
| **Authentication & RBAC (`/api/v1/auth`)** | ✅ **COMPLETE** | JWT Token issuing, Refresh token rotation, BCrypt password hashing, Logout revocation |
| **Multi-Tenant Isolation** | ✅ **COMPLETE** | ThreadLocal `TenantContext`, JPA tenant filtering, cross-tenant object access blocked (403/404) |
| **Company & Branch Management** | ✅ **COMPLETE** | Company onboarding, branch CRUD, office GPS coordinates (latitude, longitude, radius) |
| **Employee Lifecycle (`/api/v1/employees`)** | ✅ **COMPLETE** | Profile CRUD, manager-employee linkage, role assignment (`ADMIN`, `HR`, `MANAGER`, `EMPLOYEE`) |
| **Hybrid Approval Engine (`/api/v1/hybrid`)** | ✅ **COMPLETE** | Request submission, HR approval/rejection/revocation, **Self-Approval blocked (403)** |
| **Attendance & GPS Geofence (`/api/v1/attendance`)** | ✅ **COMPLETE** | 100m Haversine distance geofencing, check-in/out timestamps, audit trail logging |
| **Database Migrations (Flyway V1–V4)** | ✅ **COMPLETE** | Schema, seed companies/users, fast-hash test data, and attendance tables |
| **Backend Integration Test Suite** | ✅ **COMPLETE** | 6 test classes covering Auth, RBAC, Tenant isolation, Company/Branch, and Hybrid flows |

---

## 2. OWASP & Security Checklist Validation

Following the Day 23 Hardening requirements, the backend architecture adheres to standard enterprise and OWASP safeguards:

- [x] **No Cross-Tenant Data Leakage**: Authenticated `tenantId` is extracted solely from the validated JWT token via `TenantContext` — clients cannot spoof `companyId` via URL or body parameters.
- [x] **RBAC & Privilege Escalation Prevention**:
  - `EMPLOYEE` cannot approve hybrid requests or access other employee salary/PII records.
  - `HR` users attempting to approve their own hybrid requests receive an explicit **403 Forbidden** error (`"Self-approval is not permitted"`).
- [x] **Token Security**:
  - Short-lived Access Tokens (24h default / configurable).
  - Rotated Refresh Tokens persisted in database with SHA-256 fingerprinting and instant revocation on `/logout`.
- [x] **Credential Hygiene**: Zero hardcoded production secrets in version control; `.env.example` placeholders provided for PostgreSQL and JWT configuration.
- [x] **GPS Spoofing & Evidence Logging**: Check-in events capture real-time device timestamps, latitude, longitude, and computed distance against branch centers for audit analysis.

---

## 3. Verified API Endpoint Matrix

```
[Client / Web / Mobile] ──(Bearer JWT)──► [JwtAuthenticationFilter]
                                                  │
                                          [TenantContext]
                                                  │
                ┌───────────────────┬─────────────┴─────┬───────────────────┐
                ▼                   ▼                   ▼                   ▼
          /api/v1/auth       /api/v1/companies    /api/v1/hybrid    /api/v1/attendance
         • login            • CRUD branches     • submit request   • 100m geofence check
         • refresh          • GPS coordinates   • HR decision      • checkin / checkout
         • me               • tenant bounds     • revocation       • event history
```

| Method | Endpoint | Authorization | Key Logic / Security Constraint |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | Public | Validates credentials, issues JWT access + refresh token |
| `POST` | `/api/v1/auth/refresh` | Public | Rotates single-use refresh token; detects token replay |
| `GET` | `/api/v1/auth/me` | Authenticated | Returns current principal, assigned roles, and tenant ID |
| `GET/POST` | `/api/v1/companies` | `ADMIN`, `HR` | Company profile operations |
| `GET/POST` | `/api/v1/branches` | Authenticated | Configures office latitude, longitude, and geofence radius |
| `GET/POST` | `/api/v1/employees` | `ADMIN`, `HR` | Filter by department, designation, status; tenant-isolated |
| `POST` | `/api/v1/hybrid/requests` | Authenticated | Submits remote/WFH work request for validity period |
| `POST` | `/api/v1/hybrid/{id}/decision` | `ADMIN`, `HR` | Approves or rejects request; blocks self-approval (403) |
| `POST` | `/api/v1/hybrid/{id}/revoke` | `ADMIN`, `HR` | Revokes approved request with reason logged to audit |
| `POST` | `/api/v1/attendance/checkin` | Authenticated | Enforces $\le$ 100m distance calculation or valid hybrid state |

---

## 4. Phase 1 Team Handoff Directives

As **Project Lead (Imran)**, the following assignments are issued to the team leads for Phase 1 closure and Phase 2 commencement:

### A. Web Frontend (Jagadeesh)
- Bind the completed React `Login.tsx`, `Dashboard.tsx`, and `EmployeeList.tsx` to the live Spring Boot API (`http://localhost:8080/api/v1/*`).
- Store the returned JWT tokens in memory/storage and attach `Authorization: Bearer <token>` via Axios interceptors.
- Handle 401 response auto-refresh using `/api/v1/auth/refresh`.

### B. Mobile App Developer (Karthick)
- Initialize the React Native Expo app under the `mobile/` directory.
- Wire up `expo-location` to prompt for high-accuracy GPS permissions on physical devices.
- Connect the Check-In button to `POST /api/v1/attendance/checkin` with device coordinates.

### C. Database Administrator (Trupthi)
- Stand up PostgreSQL server instance and verify Flyway V1–V4 migration scripts run cleanly on PostgreSQL.
- Add database indexes on `attendance_events (employee_id, event_time)` and `hybrid_requests (tenant_id, status)`.

### D. Quality Assurance (Amrutha & Vishali)
- Execute the complete test suite against live endpoints with Postman.
- Run negative tenant isolation test cases (User from Company A attempting to access Company B branch/employee).
- Validate GPS boundary edge cases ($< 100\text{m}$ allowed vs. $\ge 100\text{m}$ rejected).
