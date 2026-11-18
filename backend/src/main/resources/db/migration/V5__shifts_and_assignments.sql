-- ==============================================================================
-- PJN Tech HRMS - V5__shifts_and_assignments.sql
-- Description: Shift definitions, overnight shift support, and employee shift
-- assignment scheduling.
-- Architect: Trupthi (Senior Database Architect)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. SHIFTS TABLE (Work Shift Configurations)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    working_hours NUMERIC(4, 2) NOT NULL,
    is_overnight BOOLEAN NOT NULL DEFAULT FALSE,
    grace_period_minutes INT NOT NULL DEFAULT 15,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_shifts_tenant FOREIGN KEY (tenant_id)
        REFERENCES tenants (id) ON DELETE CASCADE,
    CONSTRAINT uq_shifts_id_tenant UNIQUE (id, tenant_id),
    CONSTRAINT uq_shifts_tenant_name UNIQUE (tenant_id, name),
    CONSTRAINT chk_shifts_working_hours CHECK (working_hours > 0),
    CONSTRAINT chk_shifts_grace CHECK (grace_period_minutes >= 0),
    CONSTRAINT chk_shifts_status CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

CREATE INDEX IF NOT EXISTS idx_shifts_tenant_id ON shifts (tenant_id);
CREATE INDEX IF NOT EXISTS idx_shifts_tenant_status ON shifts (tenant_id, status);

-- ------------------------------------------------------------------------------
-- 2. EMPLOYEE SHIFT ASSIGNMENTS (Shift Roster & Scheduling)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS employee_shift_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    shift_id UUID NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_primary BOOLEAN NOT NULL DEFAULT TRUE,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_shift_assign_tenant FOREIGN KEY (tenant_id)
        REFERENCES tenants (id) ON DELETE CASCADE,
    CONSTRAINT fk_shift_assign_employee FOREIGN KEY (employee_id, tenant_id)
        REFERENCES employees (id, tenant_id) ON DELETE CASCADE,
    CONSTRAINT fk_shift_assign_shift FOREIGN KEY (shift_id, tenant_id)
        REFERENCES shifts (id, tenant_id) ON DELETE CASCADE,
    CONSTRAINT uq_shift_assign_id_tenant UNIQUE (id, tenant_id),
    CONSTRAINT chk_shift_assign_dates CHECK (end_date IS NULL OR end_date >= start_date),
    CONSTRAINT chk_shift_assign_status CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

CREATE INDEX IF NOT EXISTS idx_shift_assign_tenant_emp_start 
    ON employee_shift_assignments (tenant_id, employee_id, start_date);
CREATE INDEX IF NOT EXISTS idx_shift_assign_tenant_shift 
    ON employee_shift_assignments (tenant_id, shift_id);

