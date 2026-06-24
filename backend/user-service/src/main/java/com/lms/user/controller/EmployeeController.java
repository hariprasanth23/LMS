package com.lms.user.controller;

import com.lms.user.common.ApiResponse;
import com.lms.user.dto.EmployeeRequest;
import com.lms.user.dto.EmployeeResponse;
import com.lms.user.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService svc;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<EmployeeResponse>>> list(
            @RequestHeader("X-User-Role") String role, Pageable p) {
        requireAdmin(role);
        return ResponseEntity.ok(ApiResponse.success("OK", svc.page(p)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<EmployeeResponse>> me(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK", svc.byUserId(UUID.fromString(userId))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> byId(
            @RequestHeader("X-User-Role") String role, @PathVariable UUID id) {
        requireAdmin(role);
        return ResponseEntity.ok(ApiResponse.success("OK", svc.byId(id)));
    }

    @GetMapping("/department/{deptId}")
    public ResponseEntity<ApiResponse<Page<EmployeeResponse>>> byDept(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long deptId, Pageable p) {
        requireAdmin(role);
        return ResponseEntity.ok(ApiResponse.success("OK", svc.byDepartment(deptId, p)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EmployeeResponse>> create(
            @RequestHeader("X-User-Role") String role,
            @Valid @RequestBody EmployeeRequest req) {
        requireAdmin(role);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Employee created", svc.create(req)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> update(
            @RequestHeader("X-User-Role") String role,
            @PathVariable UUID id,
            @Valid @RequestBody EmployeeRequest req) {
        requireAdmin(role);
        return ResponseEntity.ok(ApiResponse.success("Employee updated", svc.update(id, req)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deactivate(
            @RequestHeader("X-User-Role") String role, @PathVariable UUID id) {
        requireAdmin(role);
        svc.deactivate(id);
        return ResponseEntity.ok(ApiResponse.success("Employee deactivated"));
    }

    private static void requireAdmin(String role) {
        if (!"ADMIN".equals(role)) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin role required");
    }
}
