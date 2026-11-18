-- ==============================================================================
-- PJN Tech HRMS - V3__work_locations_and_geofences.sql
-- Description: Work locations, GPS center coordinates, branch mapping, and
-- 100-meter default geofencing parameters.
-- Architect: Trupthi (Senior Database Architect)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. WORK LOCATIONS TABLE (Office & Remote Geofence Boundaries)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS work_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    branch_id UUID,
    name VARCHAR(255) NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    radius_meters INT NOT NULL DEFAULT 100,
    accuracy_threshold_meters NUMERIC(6, 2) NOT NULL DEFAULT 50.00,
    type VARCHAR(50) NOT NULL DEFAULT 'OFFICE',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_work_locations_tenant FOREIGN KEY (tenant_id)
        REFERENCES tenants (id) ON DELETE CASCADE,
    CONSTRAINT fk_work_locations_branch FOREIGN KEY (branch_id, tenant_id)
        REFERENCES branches (id, tenant_id) ON DELETE SET NULL,
    CONSTRAINT uq_work_locations_id_tenant UNIQUE (id, tenant_id),
    CONSTRAINT uq_work_locations_tenant_name UNIQUE (tenant_id, name),
    CONSTRAINT chk_work_locations_lat CHECK (latitude >= -90.0 AND latitude <= 90.0),
    CONSTRAINT chk_work_locations_lng CHECK (longitude >= -180.0 AND longitude <= 180.0),
    CONSTRAINT chk_work_locations_radius CHECK (radius_meters > 0),
    CONSTRAINT chk_work_locations_accuracy CHECK (accuracy_threshold_meters > 0),
    CONSTRAINT chk_work_locations_type CHECK (type IN ('OFFICE', 'REMOTE', 'CLIENT_SITE')),
    CONSTRAINT chk_work_locations_status CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

CREATE INDEX IF NOT EXISTS idx_work_locations_tenant_id ON work_locations (tenant_id);
CREATE INDEX IF NOT EXISTS idx_work_locations_tenant_branch ON work_locations (tenant_id, branch_id);
CREATE INDEX IF NOT EXISTS idx_work_locations_tenant_type ON work_locations (tenant_id, type);
CREATE INDEX IF NOT EXISTS idx_work_locations_tenant_status ON work_locations (tenant_id, status);

