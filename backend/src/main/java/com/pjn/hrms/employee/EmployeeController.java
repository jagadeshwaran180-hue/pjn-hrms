package com.pjn.hrms.employee;

import com.pjn.hrms.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('COMPANY_ADMIN', 'HR')")
    public ResponseEntity<EmployeeDto> createEmployee(@RequestBody EmployeeDto dto) {
        return ResponseEntity.ok(employeeService.createEmployee(dto));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('COMPANY_ADMIN', 'HR')")
    public ResponseEntity<List<EmployeeDto>> listEmployees() {
        return ResponseEntity.ok(employeeService.listEmployees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDto> getEmployee(@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        // Enforce boundary: Employee can only view their own profile unless HR/Admin
        if (!"COMPANY_ADMIN".equals(principal.getRole()) && !"HR".equals(principal.getRole()) && !id.equals(principal.getId())) {
            return ResponseEntity.status(403).build();
        }
        return employeeService.getEmployee(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/category")
    @PreAuthorize("hasAnyRole('COMPANY_ADMIN', 'HR')")
    public ResponseEntity<EmployeeDto> updateCategory(
            @PathVariable UUID id,
            @RequestBody CategoryChangeRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(employeeService.updateCategory(
                id, request.newCategory(), request.reason(), principal.getId()
        ));
    }

    @GetMapping("/{id}/category-history")
    @PreAuthorize("hasAnyRole('COMPANY_ADMIN', 'HR')")
    public ResponseEntity<List<CategoryHistoryEntry>> getCategoryHistory(@PathVariable UUID id) {
        return ResponseEntity.ok(employeeService.getCategoryHistory(id));
    }
}
