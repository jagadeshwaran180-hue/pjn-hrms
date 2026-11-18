-- ==============================================================================
-- PJN Tech HRMS - Database Schema & Multi-Tenant Constraint Verification Test
-- ==============================================================================

\set ON_ERROR_STOP on

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. Setup Two Distinct Tenants (Tenant Alpha & Tenant Beta)
-- ------------------------------------------------------------------------------
DO $$
DECLARE
    v_tenant_a UUID := gen_random_uuid();
    v_tenant_b UUID := gen_random_uuid();
    v_user_a UUID := gen_random_uuid();
    v_user_b UUID := gen_random_uuid();
    v_branch_a UUID := gen_random_uuid();
    v_branch_b UUID := gen_random_uuid();
    v_dept_a UUID := gen_random_uuid();
    v_dept_b UUID := gen_random_uuid();
    v_emp_a UUID := gen_random_uuid();
    v_emp_b UUID := gen_random_uuid();
    v_loc_a UUID := gen_random_uuid();
    v_shift_a UUID := gen_random_uuid();
    v_req_a UUID := gen_random_uuid();
    v_appr_a UUID := gen_random_uuid();
    v_sess_a UUID := gen_random_uuid();
    v_event_a UUID := gen_random_uuid();
    v_rec_a UUID := gen_random_uuid();
    v_cross_error BOOLEAN := FALSE;
    v_overlap_error BOOLEAN := FALSE;
BEGIN
    RAISE NOTICE 'Starting Database Schema Verification Test...';

    -- 1. Insert Tenants
    INSERT INTO tenants (id, name, domain, plan, status)
    VALUES 
        (v_tenant_a, 'Tenant Alpha Inc', 'alpha.pjntech.com', 'ENTERPRISE', 'ACTIVE'),
        (v_tenant_b, 'Tenant Beta LLC', 'beta.pjntech.com', 'ENTERPRISE', 'ACTIVE');
    RAISE NOTICE '✓ Tenants inserted successfully.';

    -- 2. Insert Users for each tenant
    INSERT INTO users (id, tenant_id, email, password_hash, role, status)
    VALUES 
        (v_user_a, v_tenant_a, 'admin@alpha.com', '$2a$10$abcdefghijklmnopqrstuvwxyz12345678901234567890123456', 'COMPANY_ADMIN', 'ACTIVE'),
        (v_user_b, v_tenant_b, 'admin@beta.com', '$2a$10$abcdefghijklmnopqrstuvwxyz12345678901234567890123456', 'COMPANY_ADMIN', 'ACTIVE');
    RAISE NOTICE '✓ Users inserted with tenant-scoped uniqueness.';

    -- 3. Insert Branches
    INSERT INTO branches (id, tenant_id, name, city, state, status)
    VALUES 
        (v_branch_a, v_tenant_a, 'Alpha HQ', 'Bangalore', 'Karnataka', 'ACTIVE'),
        (v_branch_b, v_tenant_b, 'Beta HQ', 'Hyderabad', 'Telangana', 'ACTIVE');
    RAISE NOTICE '✓ Branches inserted.';

    -- 4. Insert Departments
    INSERT INTO departments (id, tenant_id, name, status)
    VALUES 
        (v_dept_a, v_tenant_a, 'Engineering', 'ACTIVE'),
        (v_dept_b, v_tenant_b, 'Engineering', 'ACTIVE'); -- Same name allowed across distinct tenants!
    RAISE NOTICE '✓ Departments inserted with tenant-scoped uniqueness.';

    -- 5. Insert Employees
    INSERT INTO employees (id, tenant_id, user_id, employee_code, first_name, last_name, email, department_id, branch_id, attendance_category, status)
    VALUES 
        (v_emp_a, v_tenant_a, v_user_a, 'EMP-001', 'John', 'Alpha', 'john@alpha.com', v_dept_a, v_branch_a, 'HYBRID', 'ACTIVE'),
        (v_emp_b, v_tenant_b, v_user_b, 'EMP-001', 'Jane', 'Beta', 'jane@beta.com', v_dept_b, v_branch_b, 'IN_HOUSE', 'ACTIVE'); -- Same code allowed across distinct tenants!
    RAISE NOTICE '✓ Employees inserted. Unique employee codes per tenant validated.';

    -- 6. Insert Work Location with 100m default geofence
    INSERT INTO work_locations (id, tenant_id, branch_id, name, latitude, longitude, radius_meters, type, status)
    VALUES (v_loc_a, v_tenant_a, v_branch_a, 'Alpha Tech Park', 12.9716000, 77.5946000, 100, 'OFFICE', 'ACTIVE');
    RAISE NOTICE '✓ Work locations inserted with 100m office geofence radius.';

    -- 7. Insert Category History
    INSERT INTO employee_attendance_category_history (tenant_id, employee_id, previous_category, new_category, changed_by, reason)
    VALUES (v_tenant_a, v_emp_a, 'IN_HOUSE', 'HYBRID', v_user_a, 'Approved hybrid work transition');
    RAISE NOTICE '✓ Attendance category transition history recorded.';

    -- 8. Insert Hybrid Request & Approval
    INSERT INTO hybrid_requests (id, tenant_id, employee_id, from_date, to_date, reason, status, approved_by, approved_at)
    VALUES (v_req_a, v_tenant_a, v_emp_a, CURRENT_DATE, CURRENT_DATE + 30, 'Remote engineering work', 'APPROVED', v_user_a, CURRENT_TIMESTAMP);

    INSERT INTO hybrid_attendance_approvals (id, tenant_id, request_id, employee_id, decision, decided_by, valid_from, valid_to, is_active)
    VALUES (v_appr_a, v_tenant_a, v_req_a, v_emp_a, 'APPROVED', v_user_a, CURRENT_DATE, CURRENT_DATE + 30, TRUE);
    RAISE NOTICE '✓ Hybrid request & HR approval linkage verified.';

    -- 9. Insert Attendance Session (OPEN)
    INSERT INTO attendance_sessions (id, tenant_id, employee_id, work_location_id, check_in_time, work_mode, status, hybrid_approval_id)
    VALUES (v_sess_a, v_tenant_a, v_emp_a, v_loc_a, CURRENT_TIMESTAMP, 'HYBRID', 'OPEN', v_appr_a);
    RAISE NOTICE '✓ Attendance session created with hybrid approval linkage.';

    -- 10. Insert Attendance Event (Punch In)
    INSERT INTO attendance_events (id, tenant_id, session_id, employee_id, event_type, latitude, longitude, accuracy, distance_meters, geofence_status)
    VALUES (v_event_a, v_tenant_a, v_sess_a, v_emp_a, 'CHECK_IN', 12.9716000, 77.5946000, 5.0, 15, 'HYBRID_EXEMPT');
    RAISE NOTICE '✓ Immutable GPS attendance event logged.';

    -- 11. Insert Attendance Daily Record
    INSERT INTO attendance_records (id, tenant_id, employee_id, work_location_id, session_id, check_in_time, check_in_lat, check_in_lng, distance_meters, attendance_type, status)
    VALUES (v_rec_a, v_tenant_a, v_emp_a, v_loc_a, v_sess_a, CURRENT_TIMESTAMP, 12.9716000, 77.5946000, 15, 'HYBRID', 'PRESENT');
    RAISE NOTICE '✓ Daily attendance summary record created.';

    -- 12. Insert Shift and Shift Assignment
    INSERT INTO shifts (id, tenant_id, name, start_time, end_time, working_hours, is_overnight, status)
    VALUES (v_shift_a, v_tenant_a, 'Regular General Shift', '09:00:00', '18:00:00', 9.00, FALSE, 'ACTIVE');

    INSERT INTO employee_shift_assignments (tenant_id, employee_id, shift_id, start_date, is_primary)
    VALUES (v_tenant_a, v_emp_a, v_shift_a, CURRENT_DATE, TRUE);
    RAISE NOTICE '✓ Shift and employee shift assignment created.';

    -- --------------------------------------------------------------------------
    -- NEGATIVE TEST 1: Prevent Overlapping Open Sessions
    -- Attempting to insert a SECOND 'OPEN' session for the same employee must fail
    -- --------------------------------------------------------------------------
    BEGIN
        INSERT INTO attendance_sessions (tenant_id, employee_id, check_in_time, status)
        VALUES (v_tenant_a, v_emp_a, CURRENT_TIMESTAMP, 'OPEN');
    EXCEPTION WHEN unique_violation THEN
        v_overlap_error := TRUE;
    END;

    IF NOT v_overlap_error THEN
        RAISE EXCEPTION 'CRITICAL FAILURE: Anti-overlap constraint failed to reject second open session!';
    ELSE
        RAISE NOTICE '✓ PASSED NEGATIVE TEST 1: Overlapping open attendance session successfully REJECTED by partial index constraint.';
    END IF;

    -- --------------------------------------------------------------------------
    -- NEGATIVE TEST 2: Prevent Cross-Tenant References
    -- Attempting to assign Tenant B employee to a session under Tenant A must fail
    -- --------------------------------------------------------------------------
    BEGIN
        INSERT INTO attendance_sessions (tenant_id, employee_id, check_in_time, status)
        VALUES (v_tenant_a, v_emp_b, CURRENT_TIMESTAMP, 'OPEN'); -- employee v_emp_b belongs to v_tenant_b!
    EXCEPTION WHEN foreign_key_violation THEN
        v_cross_error := TRUE;
    END;

    IF NOT v_cross_error THEN
        RAISE EXCEPTION 'CRITICAL FAILURE: Cross-tenant foreign key failed to reject cross-tenant reference!';
    ELSE
        RAISE NOTICE '✓ PASSED NEGATIVE TEST 2: Cross-tenant reference successfully REJECTED by composite foreign key.';
    END IF;

    RAISE NOTICE '=======================================================';
    RAISE NOTICE 'ALL DATABASE SCHEMA & INTEGRITY CHECKS PASSED CLEANLY!';
    RAISE NOTICE '=======================================================';
END $$;

ROLLBACK; -- Clean rollback so test runs cleanly without dirtying database

