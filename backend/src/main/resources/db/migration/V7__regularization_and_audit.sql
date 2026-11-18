-- ==============================================================================
-- PJN Tech HRMS - V7__regularization_and_audit.sql
-- Description: Attendance regularization workflows and enterprise immutable
-- security/audit trail logs.
-- Architect: Trupthi (Senior Database Architect)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. REGULARIZATION REQUESTS TABLE (Attendance Dispute & Punch Corrections)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS regularization_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    attendance_date DATE NOT NULL,
    regularization_type VARCHAR(100) NOT NULL DEFAULT 'MISSED_PUNCH',
    requested_check_in TIMESTAMPTZ,
    requested_check_out TIMESTAMPTZ,
    reason TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_regularization_tenant FOREIGN KEY (tenant_id)
        REFERENCES tenants (id) ON DELETE CASCADE,
    CONSTRAINT fk_regularization_employee FOREIGN KEY (employee_id, tenant_id)
        REFERENCES employees (id, tenant_id) ON DELETE CASCADE,
    CONSTRAINT fk_regularization_approver FOREIGN KEY (approved_by, tenant_id)
        REFERENCES users (id, tenant_id) ON DELETE SET NULL,
    CONSTRAINT uq_regularization_id_tenant UNIQUE (id, tenant_id),
    CONSTRAINT chk_regularization_type CHECK (regularization_type IN (
        'MISSED_PUNCH', 'MISSED_CHECK_IN', 'MISSED_CHECK_OUT', 
        'GPS_TIMEOUT', 'ON_DUTY_CLIENT_VISIT', 'OTHER'
    )),
    CONSTRAINT chk_regularization_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    CONSTRAINT chk_regularization_punches CHECK (
        requested_check_out IS NULL OR requested_check_in IS NULL OR requested_check_out >= requested_check_in
    )
);

CREATE INDEX IF NOT EXISTS idx_regularization_tenant_id ON regularization_requests (tenant_id);
CREATE INDEX IF NOT EXISTS idx_regularization_tenant_emp_date 
    ON regularization_requests (tenant_id, employee_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_regularization_tenant_status 
    ON regularization_requests (tenant_id, status);

-- ------------------------------------------------------------------------------
-- 2. AUDIT LOGS TABLE (Comprehensive System & Security Audit Trail)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_logs_tenant FOREIGN KEY (tenant_id)
        REFERENCES tenants (id) ON DELETE CASCADE,
    CONSTRAINT fk_audit_logs_user FOREIGN KEY (user_id, tenant_id)
        REFERENCES users (id, tenant_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_time ON audit_logs (tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_entity ON audit_logs (tenant_id, entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_user ON audit_logs (tenant_id, user_id);

