
# PJN Tech HRMS

## Human Resource Management System

PJN Tech HRMS is a multi-tenant Human Resource
Management System designed for Web, Android, and iOS.

The application manages employees, attendance,
leave, shifts, hybrid work approvals, and HR operations.

## 1. Technology Stack

| Layer | Technology |
|-------|------------|
| Web Frontend | React.js + TypeScript |
| Mobile Application | React Native + Expo |
| Backend | Java Spring Boot |
| Database | PostgreSQL |
| Authentication | Spring Security + JWT |
| UI/UX | Figma |
| Version Control | GitHub |
| API Documentation | OpenAPI / Swagger |
| Testing | JUnit, Postman, Web/Mobile QA |

## 2. Project Architecture

- React.js: Admin and HR Web Application
- React Native + Expo: Android/iOS Employee App
- Spring Boot: REST APIs and Business Logic
- PostgreSQL: Multi-Tenant Database
- JWT + RBAC: Authentication and Authorization

Both frontend applications communicate with
Spring Boot through secured REST APIs.

## 3. Core Modules

1. Authentication and Authorization
2. Company and Branch Management
3. Employee Management
4. GPS-Based Attendance
5. Hybrid Attendance Approval
6. Leave Management
7. Shift Management
8. Holiday Calendar
9. Attendance Regularization
10. Reports and Analytics
11. Audit Logs
12. Company Settings

## 4. Mandatory Business Requirements

### In-House Attendance
- Employees can check in/out only within 100 meters
  of their assigned company office.
- Validate GPS coordinates on the backend.
- Store timestamps and attendance history.

### Hybrid Attendance
- Requires HR approval before remote attendance.
- Support approval, rejection and revocation.
- Enforce approval validity and expiry.
- Maintain an audit trail of HR decisions.

### Multi-Tenant Security
- Support multiple companies.
- Isolate company and employee data.
- Enforce tenant authorization in the backend.
- Prevent cross-company data access.

### Application Platforms
- Admin: Web Dashboard
- HR: Web Dashboard and Mobile Attendance
- Employee: Android/iOS Mobile Application

## 5. Team Members and Responsibilities

| Member | Role | Responsibilities |
|--------|------|------------------|
| Imran | Project Lead | Architecture and API contracts; security/OWASP review; task assignments, daily progress, PR approvals, integration and stakeholder reporting |
| Jagadeesh | Web Frontend | React web admin and HR dashboard; company/branch/employee screens; hybrid approval UI; attendance reports and integration |
| Karthick | Mobile Developer | Expo Android/iOS employee app; login, location permission, geofence feedback, check-in/out, hybrid requests, history and build testing |
| Trupthi | Database Developer | Multi-tenant PostgreSQL schema, migrations, company/branch relations, tenant constraints, indexing and backup/restore tests |
| Ayesha | Backend Lead | Company onboarding, authentication, employee and HR APIs, RBAC, tenant enforcement, hybrid approval endpoints and API documentation |
| Anuvrath | Attendance Backend | 100m geofence validation, attendance event logic, working hours, shift rules, audit trails, approval validity/revocation enforcement |
| Amrutha | QA Web/API | Test cases, web flows, API contracts, tenant isolation and authorization negative tests; regression and defect tracking |
| Vishali | QA Mobile/Security | Android/iOS tests, location edge cases, GPS denial/inaccuracy, hybrid approval/revocation, mobile security regression |

## 6. Day-by-Day Execution
### 16 to 22 November 2026

### Day 1 - 16 November
Project Initialization

- Imran: Repository, README, architecture, API contracts
- Jagadeesh: React setup, Login UI, Dashboard layout
- Karthick: Expo setup, mobile navigation, Login UI
- Trupthi: PostgreSQL setup and ER diagram
- Ayesha: Spring Boot setup and authentication design
- Anuvrath: Attendance API design and geofence logic
- Amrutha: Web/API test plan and test cases
- Vishali: Mobile/security test plan

Deliverable:
Project structure, initial UI, database design,
API specifications and QA test plans.

### Day 2 - 17 November
Authentication and Company Setup

- Imran: Review authentication and API contracts
- Jagadeesh: Company and Branch UI
- Karthick: Mobile authentication screens
- Trupthi: Company, branch, user and role migrations
- Ayesha: Authentication and company APIs
- Anuvrath: Attendance entities and service foundation
- Amrutha: Authentication and RBAC API tests
- Vishali: Mobile login and permission tests

Deliverable:
Initial authentication and company modules.

### Day 3 - 18 November
Employee Management

- Imran: Integration review
- Jagadeesh: Employee list, add/edit and profile UI
- Karthick: Mobile Home and Profile UI
- Trupthi: Employee schema and indexes
- Ayesha: Employee CRUD APIs
- Anuvrath: Attendance event API foundation
- Amrutha: Employee API and tenant isolation tests
- Vishali: Mobile navigation and profile tests

Deliverable:
Employee management functionality.

### Day 4 - 19 November
GPS Attendance

- Imran: Geofence security and architecture review
- Jagadeesh: Attendance Dashboard UI
- Karthick: GPS permission and Check-In/Out UI
- Trupthi: Attendance tables and constraints
- Ayesha: Attendance API integration support
- Anuvrath: 100m GPS validation and attendance logic
- Amrutha: Attendance API tests
- Vishali: GPS accuracy, denial and boundary tests

Deliverable:
Initial GPS-based attendance workflow.

### Day 5 - 20 November
Hybrid Attendance Approval

- Imran: Approval workflow and security review
- Jagadeesh: HR Hybrid Approval UI
- Karthick: Hybrid request and status screens
- Trupthi: Hybrid approval schema and migrations
- Ayesha: HR approval/rejection APIs
- Anuvrath: Approval validity/revocation enforcement
- Amrutha: Hybrid approval API tests
- Vishali: Hybrid request and revocation tests

Deliverable:
Hybrid attendance approval workflow.

### Day 6 - 21 November
Attendance History and Reporting

- Imran: Integration and progress review
- Jagadeesh: Attendance Reports UI
- Karthick: Attendance History UI
- Trupthi: Reporting indexes and query optimization
- Ayesha: HR reporting APIs
- Anuvrath: Working hours and shift calculations
- Amrutha: Reporting and regression tests
- Vishali: Mobile attendance history tests

Deliverable:
Attendance history and initial reporting.

### Day 7 - 22 November
Integration and QA

- Imran: PR review, integration and stakeholder update
- Jagadeesh: Web API integration and UI fixes
- Karthick: Mobile API integration and build testing
- Trupthi: Database validation and backup/restore tests
- Ayesha: Backend integration and API documentation
- Anuvrath: Attendance edge cases and audit trails
- Amrutha: Web/API regression and security tests
- Vishali: Android/iOS regression and security tests

Deliverable:
Integrated initial HRMS build with QA reports.

## 7. Repository Structure

PJN-Tech-HRMS/
- web/
- mobile/
- backend/
- database/
- docs/
- .github/
- .gitignore
- .env.example
- README.md

## 8. GitHub Branching Strategy

main:
Stable, approved code.

dev:
Development integration branch.

feature/*:
Individual developer task branches.

### Branch Examples

- feature/web-dashboard
- feature/mobile-attendance
- feature/database-schema
- feature/backend-auth
- feature/attendance-geofence
- test/web-api
- test/mobile-security

## 9. Development Rules

1. Never push directly to main.
2. Create feature branches from dev.
3. Submit pull requests targeting dev.
4. Project Lead reviews and approves PRs.
5. Never commit passwords, tokens or secrets.
6. Follow OWASP security guidelines.
7. Enforce RBAC and tenant isolation.
8. Validate attendance rules on the backend.
9. Write and execute relevant tests.
10. Document API changes.
11. Report daily progress and blockers.
12. Resolve merge conflicts before integration.

## 10. Daily Reporting Format

Each developer must report:

- Completed Tasks
- Pending Tasks
- GitHub Branch
- Pull Request Link
- Test Results
- Blockers
- Next-Day Plan

## 11. Project Timeline

Development Start: 16 November 2026

Initial Execution Plan:
16 November - 22 November 2026

The seven-day plan covers the initial implementation
and integration phase.

The broader 12-day milestone remains the initial MVP
target, not a production-readiness guarantee.

## 12. Project Lead

Imran
PJN Tech HRMS
