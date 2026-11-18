-- ==============================================================================
-- PJN Tech HRMS - V6__leave_and_holidays.sql
-- Description: Leave types, employee leave requests with workflow status,
-- and organization holiday calendar.
-- Architect: Trupthi (Senior Database Architect)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. LEAVE TYPES TABLE (Tenant-Configured Leave Quotas)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS leave_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    max_days INT NOT NULL,
    is_paid BOOLEAN NOT NULL DEFAULT TRUE,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_leave_types_tenant FOREIGN KEY (tenant_id)
        REFERENCES tenants (id) ON DELETE CASCADE,
    CONSTRAINT uq_leave_types_id_tenant UNIQUE (id, tenant_id),
    CONSTRAINT uq_leave_types_tenant_name UNIQUE (tenant_id, name),
    CONSTRAINT chk_leave_types_max_days CHECK (max_days >= 0),
    CONSTRAINT chk_leave_types_status CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

CREATE INDEX IF NOT EXISTS idx_leave_types_tenant_id ON leave_types (tenant_id);
CREATE INDEX IF NOT EXISTS idx_leave_types_tenant_status ON leave_types (tenant_id, status);

-- ------------------------------------------------------------------------------
-- 2. LEAVE REQUESTS TABLE (Employee Applications & Approval Lifecycle)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    leave_type_id UUID NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    days_count NUMERIC(4, 1) NOT NULL DEFAULT 1.0,
    reason TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_leave_requests_tenant FOREIGN KEY (tenant_id)
        REFERENCES tenants (id) ON DELETE CASCADE,
    CONSTRAINT fk_leave_requests_employee FOREIGN KEY (employee_id, tenant_id)
        REFERENCES employees (id, tenant_id) ON DELETE CASCADE,
    CONSTRAINT fk_leave_requests_type FOREIGN KEY (leave_type_id, tenant_id)
        REFERENCES leave_types (id, tenant_id) ON DELETE RESTRICT,
    CONSTRAINT fk_leave_requests_approver FOREIGN KEY (approved_by, tenant_id)
        REFERENCES users (id, tenant_id) ON DELETE SET NULL,
    CONSTRAINT uq_leave_requests_id_tenant UNIQUE (id, tenant_id),
    CONSTRAINT chk_leave_requests_dates CHECK (to_date >= from_date),
    CONSTRAINT chk_leave_requests_days CHECK (days_count > 0),
    CONSTRAINT chk_leave_requests_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'))
);

CREATE INDEX IF NOT EXISTS idx_leave_requests_tenant_id ON leave_requests (tenant_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_tenant_emp_dates 
    ON leave_requests (tenant_id, employee_id, from_date, to_date);
CREATE INDEX IF NOT EXISTS idx_leave_requests_tenant_status ON leave_requests (tenant_id, status);

-- ------------------------------------------------------------------------------
-- 3. HOLIDAYS TABLE (Company & National Holiday Schedules)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS holidays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(150) NOT NULL,
    holiday_date DATE NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'NATIONAL',
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_holidays_tenant FOREIGN KEY (tenant_id)
        REFERENCES tenants (id) ON DELETE CASCADE,
    CONSTRAINT uq_holidays_id_tenant UNIQUE (id, tenant_id),
    CONSTRAINT uq_holidays_tenant_date_name UNIQUE (tenant_id, holiday_date, name),
    CONSTRAINT chk_holidays_type CHECK (type IN ('NATIONAL', 'COMPANY', 'REGIONAL', 'OPTIONAL'))
);

CREATE INDEX IF NOT EXISTS idx_holidays_tenant_id ON holidays (tenant_id);
CREATE INDEX IF NOT EXISTS idx_holidays_tenant_date ON holidays (tenant_id, holiday_date);

