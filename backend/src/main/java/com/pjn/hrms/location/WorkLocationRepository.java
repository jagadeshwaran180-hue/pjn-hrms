package com.pjn.hrms.location;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkLocationRepository extends JpaRepository<WorkLocationEntity, UUID> {
    List<WorkLocationEntity> findAllByTenantId(UUID tenantId);
    Optional<WorkLocationEntity> findByIdAndTenantId(UUID id, UUID tenantId);
}
