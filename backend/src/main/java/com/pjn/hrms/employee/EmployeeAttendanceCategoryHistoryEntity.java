package com.pjn.hrms.employee;

import com.pjn.hrms.attendance.AttendanceCategory;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "employee_attendance_category_history")
public class EmployeeAttendanceCategoryHistoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_category", nullable = false, length = 50)
    private AttendanceCategory previousCategory;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_category", nullable = false, length = 50)
    private AttendanceCategory newCategory;

    @Column(name = "effective_from", nullable = false)
    private Instant effectiveFrom = Instant.now();

    @Column(name = "effective_to")
    private Instant effectiveTo;

    @Column(name = "changed_by")
    private UUID changedBy;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public EmployeeAttendanceCategoryHistoryEntity() {}

    public EmployeeAttendanceCategoryHistoryEntity(UUID id, UUID tenantId, UUID employeeId,
                                                   AttendanceCategory previousCategory, AttendanceCategory newCategory,
                                                   Instant effectiveFrom, Instant effectiveTo, UUID changedBy,
                                                   String reason) {
        this.id = id;
        this.tenantId = tenantId;
        this.employeeId = employeeId;
        this.previousCategory = previousCategory;
        this.newCategory = newCategory;
        this.effectiveFrom = effectiveFrom != null ? effectiveFrom : Instant.now();
        this.effectiveTo = effectiveTo;
        this.changedBy = changedBy;
        this.reason = reason;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getTenantId() { return tenantId; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }

    public UUID getEmployeeId() { return employeeId; }
    public void setEmployeeId(UUID employeeId) { this.employeeId = employeeId; }

    public AttendanceCategory getPreviousCategory() { return previousCategory; }
    public void setPreviousCategory(AttendanceCategory previousCategory) { this.previousCategory = previousCategory; }

    public AttendanceCategory getNewCategory() { return newCategory; }
    public void setNewCategory(AttendanceCategory newCategory) { this.newCategory = newCategory; }

    public Instant getEffectiveFrom() { return effectiveFrom; }
    public void setEffectiveFrom(Instant effectiveFrom) { this.effectiveFrom = effectiveFrom; }

    public Instant getEffectiveTo() { return effectiveTo; }
    public void setEffectiveTo(Instant effectiveTo) { this.effectiveTo = effectiveTo; }

    public UUID getChangedBy() { return changedBy; }
    public void setChangedBy(UUID changedBy) { this.changedBy = changedBy; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
