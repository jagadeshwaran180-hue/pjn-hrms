package com.pjn.hrms.employee;

import com.pjn.hrms.attendance.AttendanceCategory;
import java.time.Instant;
import java.util.UUID;

public record CategoryHistoryEntry(
        UUID id,
        UUID employeeId,
        AttendanceCategory previousCategory,
        AttendanceCategory newCategory,
        Instant effectiveFrom,
        UUID changedBy,
        String reason
) {}
