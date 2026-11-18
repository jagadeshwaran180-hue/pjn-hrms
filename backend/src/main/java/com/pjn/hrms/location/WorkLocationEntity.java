package com.pjn.hrms.location;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "work_locations")
public class WorkLocationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "branch_id")
    private UUID branchId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "radius_meters", nullable = false)
    private Integer radiusMeters = 100;

    @Column(name = "accuracy_threshold_meters", nullable = false, precision = 6, scale = 2)
    private BigDecimal accuracyThresholdMeters = new BigDecimal("50.00");

    @Column(nullable = false, length = 50)
    private String type = "OFFICE";

    @Column(nullable = false, length = 50)
    private String status = "ACTIVE";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public WorkLocationEntity() {}

    public WorkLocationEntity(UUID id, UUID tenantId, UUID branchId, String name,
                              BigDecimal latitude, BigDecimal longitude, Integer radiusMeters,
                              BigDecimal accuracyThresholdMeters, String type, String status) {
        this.id = id;
        this.tenantId = tenantId;
        this.branchId = branchId;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.radiusMeters = radiusMeters != null ? radiusMeters : 100;
        this.accuracyThresholdMeters = accuracyThresholdMeters != null ? accuracyThresholdMeters : new BigDecimal("50.00");
        this.type = type != null ? type : "OFFICE";
        this.status = status != null ? status : "ACTIVE";
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getTenantId() { return tenantId; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }

    public UUID getBranchId() { return branchId; }
    public void setBranchId(UUID branchId) { this.branchId = branchId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public Integer getRadiusMeters() { return radiusMeters; }
    public void setRadiusMeters(Integer radiusMeters) { this.radiusMeters = radiusMeters; }

    public BigDecimal getAccuracyThresholdMeters() { return accuracyThresholdMeters; }
    public void setAccuracyThresholdMeters(BigDecimal accuracyThresholdMeters) { this.accuracyThresholdMeters = accuracyThresholdMeters; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
