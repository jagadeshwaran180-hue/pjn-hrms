package com.pjn.hrms.employee;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EmployeeAttendanceCategoryHistoryRepository extends JpaRepository<EmployeeAttendanceCategoryHistoryEntity, UUID> {
    List<EmployeeAttendanceCategoryHistoryEntity> findAllByTenantIdAndEmployeeIdOrderByEffectiveFromDesc(UUID tenantId, UUID employeeId);
}
