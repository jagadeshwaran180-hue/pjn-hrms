# PJN Tech HRMS — Backend REST APIs

## Overview
Enterprise multi-tenant backend built with Java Spring Boot, Spring Security (JWT + RBAC), and PostgreSQL for business logic, attendance geofence calculation, and tenant isolation.

## Assigned Team Members
- **Ayesha:** Backend Lead (Auth, Company/Branch, Employee APIs, Tenant Isolation)
- **Anuvrath:** Attendance Backend Lead (100m Geofence Validation, Shifts, Audit Trails)

## Tech Stack
- **Framework:** Java 17 / 21, Spring Boot 3.x
- **Security:** Spring Security + JWT, OWASP Top 10 (2025)
- **Database:** PostgreSQL (Multi-Tenant schema)
- **API Docs:** OpenAPI 3.0 / Swagger UI

## API Endpoints Overview
- `/api/v1/auth/**`: Login, Refresh, Password Reset
- `/api/v1/companies/**`: Tenant & Branch management
- `/api/v1/employees/**`: Employee CRUD & Profiles
- `/api/v1/attendance/**`: Check-in/out with 100m coordinate validation
- `/api/v1/hybrid/**`: HR Hybrid approval, rejection, and revocation
- `/api/v1/reports/**`: Attendance analytics & CSV/PDF exports
