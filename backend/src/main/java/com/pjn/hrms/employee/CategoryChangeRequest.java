package com.pjn.hrms.employee;

import com.pjn.hrms.attendance.AttendanceCategory;
import java.util.UUID;

public record CategoryChangeRequest(
        AttendanceCategory newCategory,
        String reason
) {}
