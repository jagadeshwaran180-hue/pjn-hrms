package com.pjn.hrms.employee;

import com.pjn.hrms.attendance.AttendanceCategory;
import com.pjn.hrms.tenant.TenantContext;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final Map<UUID, EmployeeDto> employeeDb = new ConcurrentHashMap<>();
    private final List<CategoryHistoryEntry> historyLedger = Collections.synchronizedList(new ArrayList<>());

    public EmployeeService() {
        // Seed default employees for PJN TECH
        UUID defaultTenant = UUID.nameUUIDFromBytes("PJN-TECH".getBytes());
        UUID adminId = UUID.nameUUIDFromBytes("admin@pjn.com".getBytes());
        UUID empId = UUID.nameUUIDFromBytes("emp@pjn.com".getBytes());

        employeeDb.put(adminId, new EmployeeDto(adminId, defaultTenant, "EMP-001", "Imran", "Lead",
                "admin@pjn.com", "Engineering", "Project Lead", "COMPANY_ADMIN", AttendanceCategory.HYBRID, null, true));
        employeeDb.put(empId, new EmployeeDto(empId, defaultTenant, "EMP-002", "Jagadeesh", "Frontend",
                "emp@pjn.com", "Engineering", "Web Developer", "EMPLOYEE", AttendanceCategory.IN_HOUSE, null, true));
    }

    public EmployeeDto createEmployee(EmployeeDto dto) {
        UUID tenantId = TenantContext.getTenantId();
        UUID id = dto.id() != null ? dto.id() : UUID.randomUUID();
        EmployeeDto saved = new EmployeeDto(
                id,
                tenantId,
                dto.employeeCode(),
                dto.firstName(),
                dto.lastName(),
                dto.email(),
                dto.department(),
                dto.designation(),
                dto.role() != null ? dto.role() : "EMPLOYEE",
                dto.attendanceCategory() != null ? dto.attendanceCategory() : AttendanceCategory.IN_HOUSE,
                dto.branchId(),
                true
        );
        employeeDb.put(id, saved);
        return saved;
    }

    public List<EmployeeDto> listEmployees() {
        UUID tenantId = TenantContext.getTenantId();
        return employeeDb.values().stream()
                .filter(e -> tenantId == null || tenantId.equals(e.tenantId()))
                .collect(Collectors.toList());
    }

    public Optional<EmployeeDto> getEmployee(UUID id) {
        UUID tenantId = TenantContext.getTenantId();
        EmployeeDto emp = employeeDb.get(id);
        if (emp != null && (tenantId == null || tenantId.equals(emp.tenantId()))) {
            return Optional.of(emp);
        }
        return Optional.empty();
    }

    public EmployeeDto updateCategory(UUID id, AttendanceCategory newCategory, String reason, UUID changedBy) {
        EmployeeDto emp = getEmployee(id).orElseThrow(() -> new NoSuchElementException("Employee not found"));
        AttendanceCategory previous = emp.attendanceCategory();

        EmployeeDto updated = new EmployeeDto(
                emp.id(), emp.tenantId(), emp.employeeCode(), emp.firstName(), emp.lastName(),
                emp.email(), emp.department(), emp.designation(), emp.role(), newCategory, emp.branchId(), emp.active()
        );
        employeeDb.put(id, updated);

        // Immutable history ledger entry
        historyLedger.add(new CategoryHistoryEntry(
                UUID.randomUUID(), id, previous, newCategory, Instant.now(), changedBy, reason
        ));

        return updated;
    }

    public List<CategoryHistoryEntry> getCategoryHistory(UUID employeeId) {
        return historyLedger.stream()
                .filter(h -> h.employeeId().equals(employeeId))
                .collect(Collectors.toList());
    }
}
