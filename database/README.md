# PJN Tech HRMS — Database & Schema Migrations

## Overview
PostgreSQL multi-tenant database design with strict tenant isolation, foreign key constraints, indexing, and audit logging.

## Assigned Team Member
- **Trupthi:** Database Developer (Schema, Indexes, ER Diagrams, Migrations)

## Core Entities
- `tenants` (Company master)
- `branches` (GPS center coordinates: latitude, longitude, radius)
- `users` & `roles` (RBAC authentication)
- `employees` (Staff directory)
- `attendance_events` (Check-in/out timestamps, coordinate points, geofence status)
- `hybrid_requests` (Authorization window, HR approval, revocation trail)
- `audit_logs` (Immutable security audit records)
