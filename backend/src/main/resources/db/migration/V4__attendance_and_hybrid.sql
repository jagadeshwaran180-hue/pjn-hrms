-- ==============================================================================
-- PJN Tech HRMS - V4__attendance_and_hybrid.sql
-- Description: Comprehensive attendance engine:
-- 1. hybrid_requests (WFH/Remote requests)
-- 2. hybrid_attendance_approvals (HR decisions, active validity window, revocation)
-- 3. attendance_sessions (Stateful shift/session tracking, anti-overlap constraint)
-- 4. attendance_events (Immutable raw GPS punches & 100m geofence audit trail)
-- 5. attendance_records (Daily aggregated summary table matching conceptual diagram)
-- Architect: Trupthi (Senior Database Architect)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. HYBRID REQUESTS TABLE (Employee Remote/WFH Applications)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hybrid_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    request_date DATE NOT NULL DEFAULT CURRENT_DATE,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hybrid_requests_tenant FOREIGN KEY (tenant_id)
        REFERENCES tenants (id) ON DELETE CASCADE,
    CONSTRAINT fk_hybrid_requests_employee FOREIGN KEY (employee_id, tenant_id)
        REFERENCES employees (id, tenant_id) ON DELETE CASCADE,
    CONSTRAINT fk_hybrid_requests_approver FOREIGN KEY (approved_by, tenant_id)
        REFERENCES users (id, tenant_id) ON DELETE SET NULL,
    CONSTRAINT uq_hybrid_requests_id_tenant UNIQUE (id, tenant_id),
    CONSTRAINT chk_hybrid_requests_dates CHECK (to_date >= from_date),
    CONSTRAINT chk_hybrid_requests_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'REVOKED'))
);

CREATE INDEX IF NOT EXISTS idx_hybrid_requests_tenant_id ON hybrid_requests (tenant_id);
-- Required Day 23 Index
CREATE INDEX IF NOT EXISTS idx_hybrid_requests_tenant_status ON hybrid_requests (tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_hybrid_requests_tenant_emp_dates 
    ON hybrid_requests (tenant_id, employee_id, from_date, to_date);

-- ------------------------------------------------------------------------------
-- 2. HYBRID ATTENDANCE APPROVALS (HR Decisions & Validity Window)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hybrid_attendance_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    request_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    decision VARCHAR(50) NOT NULL,
    decided_by UUID NOT NULL,
    decided_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    revoked_by UUID,
    revoked_at TIMESTAMPTZ,
    revocation_reason TEXT,
    comments TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hybrid_approvals_tenant FOREIGN KEY (tenant_id)
        REFERENCES tenants (id) ON DELETE CASCADE,
    CONSTRAINT fk_hybrid_approvals_request FOREIGN KEY (request_id, tenant_id)
        REFERENCES hybrid_requests (id, tenant_id) ON DELETE CASCADE,
    CONSTRAINT fk_hybrid_approvals_employee FOREIGN KEY (employee_id, tenant_id)
        REFERENCES employees (id, tenant_id) ON DELETE CASCADE,
    CONSTRAINT fk_hybrid_approvals_decider FOREIGN KEY (decided_by, tenant_id)
        REFERENCES users (id, tenant_id) ON DELETE RESTRICT,
    CONSTRAINT fk_hybrid_approvals_revoker FOREIGN KEY (revoked_by, tenant_id)
        REFERENCES users (id, tenant_id) ON DELETE SET NULL,
    CONSTRAINT uq_hybrid_approvals_id_tenant UNIQUE (id, tenant_id),
    CONSTRAINT chk_hybrid_approvals_dates CHECK (valid_to >= valid_from),
    CONSTRAINT chk_hybrid_approvals_decision CHECK (decision IN ('APPROVED', 'REJECTED', 'REVOKED'))
);

CREATE INDEX IF NOT EXISTS idx_hybrid_approvals_tenant_id ON hybrid_attendance_approvals (tenant_id);
CREATE INDEX IF NOT EXISTS idx_hybrid_approvals_validity 
    ON hybrid_attendance_approvals (tenant_id, employee_id, is_active, valid_from, valid_to);

-- ------------------------------------------------------------------------------
-- 3. ATTENDANCE SESSIONS (Stateful Session Tracking & Anti-Overlap Protection)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    work_location_id UUID,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    check_in_time TIMESTAMPTZ NOT NULL,
    check_out_time TIMESTAMPTZ,
    duration_minutes INT,
    work_mode VARCHAR(50) NOT NULL DEFAULT 'IN_HOUSE',
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    hybrid_approval_id UUID,
    is_overnight BOOLEAN NOT NULL DEFAULT FALSE,
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attendance_sessions_tenant FOREIGN KEY (tenant_id)
        REFERENCES tenants (id) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_sessions_employee FOREIGN KEY (employee_id, tenant_id)
        REFERENCES employees (id, tenant_id) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_sessions_location FOREIGN KEY (work_location_id, tenant_id)
        REFERENCES work_locations (id, tenant_id) ON DELETE SET NULL,
    CONSTRAINT fk_attendance_sessions_approval FOREIGN KEY (hybrid_approval_id, tenant_id)
        REFERENCES hybrid_attendance_approvals (id, tenant_id) ON DELETE SET NULL,
    CONSTRAINT uq_attendance_sessions_id_tenant UNIQUE (id, tenant_id),
    CONSTRAINT chk_attendance_sessions_mode CHECK (work_mode IN ('IN_HOUSE', 'HYBRID', 'REMOTE')),
    CONSTRAINT chk_attendance_sessions_status CHECK (status IN ('OPEN', 'COMPLETED', 'AUTO_CLOSED', 'CANCELLED')),
    CONSTRAINT chk_attendance_sessions_checkout CHECK (check_out_time IS NULL OR check_out_time >= check_in_time)
);

CREATE INDEX IF NOT EXISTS idx_attendance_sessions_tenant_emp_date 
    ON attendance_sessions (tenant_id, employee_id, session_date);

-- Partial Unique Index: Prevents an employee from having more than ONE active 'OPEN' session
CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_sessions_single_open 
    ON attendance_sessions (tenant_id, employee_id) 
    WHERE (status = 'OPEN');

-- ------------------------------------------------------------------------------
-- 4. ATTENDANCE EVENTS (Immutable GPS Raw Punches & Geofence Evidence)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    session_id UUID,
    employee_id UUID NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    accuracy NUMERIC(6, 2) NOT NULL DEFAULT 10.00,
    distance_meters INT,
    geofence_status VARCHAR(50) NOT NULL,
    device_info TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attendance_events_tenant FOREIGN KEY (tenant_id)
        REFERENCES tenants (id) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_events_session FOREIGN KEY (session_id, tenant_id)
        REFERENCES attendance_sessions (id, tenant_id) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_events_employee FOREIGN KEY (employee_id, tenant_id)
        REFERENCES employees (id, tenant_id) ON DELETE CASCADE,
    CONSTRAINT chk_attendance_events_type CHECK (event_type IN ('CHECK_IN', 'CHECK_OUT', 'PUNCH_IN', 'PUNCH_OUT')),
    CONSTRAINT chk_attendance_events_lat CHECK (latitude >= -90.0 AND latitude <= 90.0),
    CONSTRAINT chk_attendance_events_lng CHECK (longitude >= -180.0 AND longitude <= 180.0),
    CONSTRAINT chk_attendance_events_acc CHECK (accuracy >= 0),
    CONSTRAINT chk_attendance_events_geo CHECK (geofence_status IN ('INSIDE_GEOFENCE', 'OUTSIDE_GEOFENCE', 'HYBRID_EXEMPT', 'OVERRIDDEN'))
);

-- Required Day 23 Index on attendance_events (employee_id, event_time)
CREATE INDEX IF NOT EXISTS idx_attendance_events_employee_time 
    ON attendance_events (employee_id, event_time);
CREATE INDEX IF NOT EXISTS idx_attendance_events_tenant_emp_time 
    ON attendance_events (tenant_id, employee_id, event_time);

-- ------------------------------------------------------------------------------
-- 5. ATTENDANCE RECORDS (Daily Aggregated Summary Table per Conceptual Diagram)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    work_location_id UUID,
    session_id UUID,
    attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
    check_in_time TIMESTAMPTZ,
    check_out_time TIMESTAMPTZ,
    check_in_lat NUMERIC(10, 7),
    check_in_lng NUMERIC(10, 7),
    check_out_lat NUMERIC(10, 7),
    check_out_lng NUMERIC(10, 7),
    distance_meters INT,
    attendance_type VARCHAR(50) NOT NULL DEFAULT 'IN_HOUSE',
    status VARCHAR(50) NOT NULL DEFAULT 'PRESENT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attendance_records_tenant FOREIGN KEY (tenant_id)
        REFERENCES tenants (id) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_records_employee FOREIGN KEY (employee_id, tenant_id)
        REFERENCES employees (id, tenant_id) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_records_location FOREIGN KEY (work_location_id, tenant_id)
        REFERENCES work_locations (id, tenant_id) ON DELETE SET NULL,
    CONSTRAINT fk_attendance_records_session FOREIGN KEY (session_id, tenant_id)
        REFERENCES attendance_sessions (id, tenant_id) ON DELETE SET NULL,
    CONSTRAINT uq_attendance_records_id_tenant UNIQUE (id, tenant_id),
    CONSTRAINT uq_attendance_records_daily UNIQUE (tenant_id, employee_id, attendance_date),
    CONSTRAINT chk_attendance_records_type CHECK (attendance_type IN ('IN_HOUSE', 'HYBRID', 'REMOTE')),
    CONSTRAINT chk_attendance_records_status CHECK (status IN ('PRESENT', 'LATE', 'HALF_DAY', 'ABSENT', 'ON_LEAVE')),
    CONSTRAINT chk_attendance_records_checkout CHECK (check_out_time IS NULL OR check_in_time IS NULL OR check_out_time >= check_in_time)
);

CREATE INDEX IF NOT EXISTS idx_attendance_records_tenant_emp_date 
    ON attendance_records (tenant_id, employee_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_records_tenant_date_status 
    ON attendance_records (tenant_id, attendance_date, status);

