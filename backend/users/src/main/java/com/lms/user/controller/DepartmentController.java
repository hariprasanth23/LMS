package com.lms.user.controller;

import com.lms.user.common.ApiResponse;
import com.lms.user.dto.DepartmentRequest;
import com.lms.user.model.Department;
import com.lms.user.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService svc;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Department>>> list() {
        return ResponseEntity.ok(ApiResponse.success("OK", svc.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Department>> byId(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("OK", svc.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Department>> create(
            @RequestHeader("X-User-Role") String role,
            @Valid @RequestBody DepartmentRequest req) {
        requireAdmin(role);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Department created", svc.create(req)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Department>> update(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id,
            @Valid @RequestBody DepartmentRequest req) {
        requireAdmin(role);
        return ResponseEntity.ok(ApiResponse.success("Department updated", svc.update(id, req)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id) {
        requireAdmin(role);
        svc.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Department deleted"));
    }

    private static void requireAdmin(String role) {
        if (!"ADMIN".equals(role)) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin role required");
    }
}
