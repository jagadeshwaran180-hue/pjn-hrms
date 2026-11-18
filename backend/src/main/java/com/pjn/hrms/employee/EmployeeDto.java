package com.pjn.hrms.employee;

import com.pjn.hrms.attendance.AttendanceCategory;
import java.util.UUID;

public record EmployeeDto(
        UUID id,
        UUID tenantId,
        String employeeCode,
        String firstName,
        String lastName,
        String email,
        String department,
        String designation,
        String role,
        AttendanceCategory attendanceCategory,
        UUID branchId,
        boolean active
) {}
