-- ==============================================================================
-- PJN Tech HRMS - V2__employees_and_categories.sql
-- Description: Employee profiles, user-linkage, and effective-dated attendance
-- category history (IN_HOUSE / HYBRID) per ATT-H01 specification.
-- Architect: Trupthi (Senior Database Architect)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EMPLOYEES TABLE (Core Employee Master)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    user_id UUID,
    employee_code VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    department_id UUID,
    branch_id UUID,
    designation VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'EMPLOYEE',
    attendance_category VARCHAR(50) NOT NULL DEFAULT 'IN_HOUSE',
    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_employees_tenant FOREIGN KEY (tenant_id)
        REFERENCES tenants (id) ON DELETE CASCADE,
    CONSTRAINT fk_employees_user FOREIGN KEY (user_id, tenant_id)
        REFERENCES users (id, tenant_id) ON DELETE SET NULL,
    CONSTRAINT fk_employees_department FOREIGN KEY (department_id, tenant_id)
        REFERENCES departments (id, tenant_id) ON DELETE SET NULL,
    CONSTRAINT fk_employees_branch FOREIGN KEY (branch_id, tenant_id)
        REFERENCES branches (id, tenant_id) ON DELETE SET NULL,
    CONSTRAINT uq_employees_tenant_code UNIQUE (tenant_id, employee_code),
    CONSTRAINT uq_employees_tenant_email UNIQUE (tenant_id, email),
    CONSTRAINT uq_employees_id_tenant UNIQUE (id, tenant_id),
    CONSTRAINT chk_employees_category CHECK (attendance_category IN ('IN_HOUSE', 'HYBRID')),
    CONSTRAINT chk_employees_status CHECK (status IN ('ACTIVE', 'ON_LEAVE', 'INACTIVE', 'TERMINATED'))
);

CREATE INDEX IF NOT EXISTS idx_employees_tenant_id ON employees (tenant_id);
CREATE INDEX IF NOT EXISTS idx_employees_tenant_dept ON employees (tenant_id, department_id);
CREATE INDEX IF NOT EXISTS idx_employees_tenant_branch ON employees (tenant_id, branch_id);
CREATE INDEX IF NOT EXISTS idx_employees_tenant_user ON employees (tenant_id, user_id);
CREATE INDEX IF NOT EXISTS idx_employees_tenant_category ON employees (tenant_id, attendance_category);
CREATE INDEX IF NOT EXISTS idx_employees_tenant_status ON employees (tenant_id, status);

-- ------------------------------------------------------------------------------
-- 2. EMPLOYEE ATTENDANCE CATEGORY HISTORY (Audit Ledger for ATT-H01)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS employee_attendance_category_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    previous_category VARCHAR(50) NOT NULL,
    new_category VARCHAR(50) NOT NULL,
    effective_from TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    effective_to TIMESTAMPTZ,
    changed_by UUID,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_category_history_tenant FOREIGN KEY (tenant_id)
        REFERENCES tenants (id) ON DELETE CASCADE,
    CONSTRAINT fk_category_history_employee FOREIGN KEY (employee_id, tenant_id)
        REFERENCES employees (id, tenant_id) ON DELETE CASCADE,
    CONSTRAINT fk_category_history_user FOREIGN KEY (changed_by, tenant_id)
        REFERENCES users (id, tenant_id) ON DELETE SET NULL,
    CONSTRAINT uq_category_history_id_tenant UNIQUE (id, tenant_id),
    CONSTRAINT chk_cat_prev CHECK (previous_category IN ('IN_HOUSE', 'HYBRID')),
    CONSTRAINT chk_cat_new CHECK (new_category IN ('IN_HOUSE', 'HYBRID')),
    CONSTRAINT chk_cat_effective_range CHECK (effective_to IS NULL OR effective_to >= effective_from)
);

CREATE INDEX IF NOT EXISTS idx_cat_hist_tenant_emp_from 
    ON employee_attendance_category_history (tenant_id, employee_id, effective_from);

