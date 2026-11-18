-- ==============================================================================
-- PJN Tech HRMS - V1__init_schema.sql
-- Description: Core company management: tenants, users, branches, departments.
-- Multi-Tenant SaaS with strict data isolation and UUID primary keys.
-- Architect: Trupthi (Senior Database Architect)
-- ==============================================================================

-- Enable pgcrypto for UUID generation if not already active
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. TENANTS TABLE (Root SaaS Organization / Company)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    plan VARCHAR(50) NOT NULL DEFAULT 'ENTERPRISE',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tenants_domain UNIQUE (domain),
    CONSTRAINT chk_tenants_status CHECK (status IN ('ACTIVE', 'SUSPENDED', 'TRIAL', 'INACTIVE'))
);

CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants (status);

-- ------------------------------------------------------------------------------
-- 2. USERS TABLE (System Login Accounts scoped to a Tenant)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_tenant FOREIGN KEY (tenant_id) 
        REFERENCES tenants (id) ON DELETE CASCADE,
    CONSTRAINT uq_users_tenant_email UNIQUE (tenant_id, email),
    CONSTRAINT uq_users_id_tenant UNIQUE (id, tenant_id),
    CONSTRAINT chk_users_role CHECK (role IN ('ADMIN', 'COMPANY_ADMIN', 'HR', 'MANAGER', 'EMPLOYEE')),
    CONSTRAINT chk_users_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING'))
);

CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users (tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_tenant_role ON users (tenant_id, role);
CREATE INDEX IF NOT EXISTS idx_users_tenant_status ON users (tenant_id, status);

-- ------------------------------------------------------------------------------
-- 3. BRANCHES TABLE (Office branches owned by Tenant)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_branches_tenant FOREIGN KEY (tenant_id) 
        REFERENCES tenants (id) ON DELETE CASCADE,
    CONSTRAINT uq_branches_tenant_name UNIQUE (tenant_id, name),
    CONSTRAINT uq_branches_id_tenant UNIQUE (id, tenant_id),
    CONSTRAINT chk_branches_status CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

CREATE INDEX IF NOT EXISTS idx_branches_tenant_id ON branches (tenant_id);
CREATE INDEX IF NOT EXISTS idx_branches_tenant_status ON branches (tenant_id, status);

-- ------------------------------------------------------------------------------
-- 4. DEPARTMENTS TABLE (Organizational units owned by Tenant)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_departments_tenant FOREIGN KEY (tenant_id) 
        REFERENCES tenants (id) ON DELETE CASCADE,
    CONSTRAINT uq_departments_tenant_name UNIQUE (tenant_id, name),
    CONSTRAINT uq_departments_id_tenant UNIQUE (id, tenant_id),
    CONSTRAINT chk_departments_status CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

CREATE INDEX IF NOT EXISTS idx_departments_tenant_id ON departments (tenant_id);
CREATE INDEX IF NOT EXISTS idx_departments_tenant_status ON departments (tenant_id, status);

