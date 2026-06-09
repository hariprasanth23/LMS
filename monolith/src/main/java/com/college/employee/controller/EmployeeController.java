package com.college.employee.controller;

import com.college.auth.model.User;
import com.college.auth.repository.UserRepository;
import com.college.common.dto.ApiResponse;
import com.college.employee.dto.EmployeeImportRow;
import com.college.employee.dto.EmployeeRequest;
import com.college.employee.dto.EmployeeResponse;
import com.college.employee.repository.EmployeeRepository;
import com.college.employee.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.*;
import java.util.ArrayList;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@Slf4j
@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private static final String CHARS =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    private static final SecureRandom RNG = new SecureRandom();

    private String generateInitialPassword() {
        StringBuilder sb = new StringBuilder(12);
        for (int i = 0; i < 12; i++) sb.append(CHARS.charAt(RNG.nextInt(CHARS.length())));
        return sb.toString();
    }

    private final EmployeeService employeeService;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STAFF', 'STUDENT', 'PARENT', 'ALUMNI')")
    public ResponseEntity<ApiResponse<List<EmployeeResponse>>> listAll(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(ApiResponse.ok(
                employeeService.findAll(PageRequest.of(page, size, Sort.by("id")))));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STAFF')")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getMe() {
        return ResponseEntity.ok(ApiResponse.ok(employeeService.findMe()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STAFF')")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(employeeService.findById(id)));
    }

    @GetMapping("/department/{deptId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<ApiResponse<List<EmployeeResponse>>> getByDepartment(@PathVariable Long deptId) {
        return ResponseEntity.ok(ApiResponse.ok(employeeService.findByDepartment(deptId)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmployeeResponse>> create(@Valid @RequestBody EmployeeRequest request) {
        EmployeeResponse created = employeeService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Employee created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmployeeResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Employee updated successfully", employeeService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deactivate(@PathVariable UUID id) {
        employeeService.deactivate(id);
        return ResponseEntity.ok(ApiResponse.ok("Employee deactivated", null));
    }

    // ── Bulk CSV Import ───────────────────────────────────────────────────────────

    @PostMapping("/import")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> importEmployees(
            @Valid @RequestBody List<EmployeeImportRow> rows) {

        int success = 0, failure = 0;
        List<Map<String, Object>> results = new ArrayList<>();

        for (int i = 0; i < rows.size(); i++) {
            EmployeeImportRow row = rows.get(i);
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("row", i + 2);
            result.put("empCode", row.getEmpCode());
            try {
                if (employeeRepository.existsByEmpCode(row.getEmpCode())) {
                    throw new IllegalStateException("Emp code already exists: " + row.getEmpCode());
                }
                if (row.getEmail() != null && userRepository.existsByEmail(row.getEmail())) {
                    throw new IllegalStateException("Email already exists: " + row.getEmail());
                }
                User.Role role = "FACULTY".equalsIgnoreCase(row.getEmployeeType())
                        ? User.Role.FACULTY : User.Role.STAFF;
                String initialPassword = generateInitialPassword();
                User user = userRepository.save(User.builder()
                        .name(row.getName()).email(row.getEmail()).phone(row.getPhone())
                        .password(passwordEncoder.encode(initialPassword))
                        .role(role).active(true).build());

                EmployeeRequest req = new EmployeeRequest();
                req.setUserId(user.getId());
                req.setEmpCode(row.getEmpCode());
                req.setName(row.getName());
                req.setEmail(row.getEmail());
                req.setPhone(row.getPhone());
                req.setDepartmentId(row.getDepartmentId());
                req.setDesignation(row.getDesignation());
                req.setEmployeeType(row.getEmployeeType() != null ? row.getEmployeeType() : "STAFF");
                req.setJoinDate(row.getJoinDate() != null ? row.getJoinDate() : LocalDate.now());
                req.setBaseSalary(row.getBaseSalary());
                req.setQualifications(row.getQualifications());
                employeeService.create(req);

                result.put("success", true);
                result.put("message", "Imported successfully");
                result.put("initialPassword", initialPassword);
                success++;
            } catch (IllegalStateException | IllegalArgumentException e) {
                log.warn("Employee import row {}: {}", i + 2, e.getMessage());
                result.put("success", false);
                result.put("message", e.getMessage());
                failure++;
            } catch (Exception e) {
                log.error("Employee import row {} unexpected error", i + 2, e);
                result.put("success", false);
                result.put("message", "Unexpected error — contact system administrator");
                failure++;
            }
            results.add(result);
        }

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("successCount", success);
        summary.put("failureCount", failure);
        summary.put("results", results);
        return ResponseEntity.ok(ApiResponse.ok("Import complete", summary));
    }
}
