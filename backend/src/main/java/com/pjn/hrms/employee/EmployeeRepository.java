package com.pjn.hrms.employee;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmployeeRepository extends JpaRepository<EmployeeEntity, UUID> {
    List<EmployeeEntity> findAllByTenantId(UUID tenantId);
    Optional<EmployeeEntity> findByIdAndTenantId(UUID id, UUID tenantId);
    Optional<EmployeeEntity> findByTenantIdAndEmployeeCode(UUID tenantId, String employeeCode);
    Optional<EmployeeEntity> findByTenantIdAndEmail(UUID tenantId, String email);
    Optional<EmployeeEntity> findByTenantIdAndUserId(UUID tenantId, UUID userId);
}
