package com.lms.hr.controller;

import com.lms.hr.common.ApiResponse;
import com.lms.hr.model.PayrollRecord;
import com.lms.hr.repository.HrRepositories.PayrollRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollRepository repo;

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<List<PayrollRecord>>> generate(
            @RequestHeader("X-User-Role") String role,
            @Valid @RequestBody GenerateReq req) {
        requireAdmin(role);
        // v2 minimal: caller passes the per-employee figures explicitly.
        // The monolith auto-fetched from EmployeeRepository — that cross-service
        // call would need a Feign client to backend/user-service; deferred.
        List<PayrollRecord> created = req.getEmployees().stream().map(e ->
            repo.save(PayrollRecord.builder()
                .employeeId(e.getEmployeeId())
                .month(req.getMonth()).year(req.getYear())
                .baseSalary(e.getBaseSalary())
                .allowance(e.getAllowance() != null ? e.getAllowance() : BigDecimal.ZERO)
                .deduction(e.getDeduction() != null ? e.getDeduction() : BigDecimal.ZERO)
                .bonus(e.getBonus() != null ? e.getBonus() : BigDecimal.ZERO)
                .status("DRAFT").build())
        ).toList();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Generated " + created.size() + " payroll records", created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PayrollRecord>>> all(
            @RequestHeader("X-User-Role") String role,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        requireAdmin(role);
        return ResponseEntity.ok(ApiResponse.success("OK",
                (month != null && year != null) ? repo.findByMonthAndYear(month, year) : repo.findAll()));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<PayrollRecord>>> mine(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                repo.findByEmployeeIdOrderByYearDescMonthDesc(UUID.fromString(userId))));
    }

    @PutMapping("/{id}/process")
    public ResponseEntity<ApiResponse<PayrollRecord>> process(
            @RequestHeader("X-User-Role") String role, @PathVariable UUID id) {
        requireAdmin(role);
        PayrollRecord r = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payroll record not found"));
        r.setStatus("PROCESSED");
        return ResponseEntity.ok(ApiResponse.success("Processed", repo.save(r)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PayrollRecord>> byId(
            @RequestHeader("X-User-Role") String role, @PathVariable UUID id) {
        requireAdmin(role);
        return ResponseEntity.ok(ApiResponse.success("OK",
                repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Payroll record not found"))));
    }

    private static void requireAdmin(String role) {
        if (!"ADMIN".equals(role)) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin role required");
    }

    @Data public static class GenerateReq {
        @NotNull @Min(1) @Max(12) private Integer month;
        @NotNull @Min(2020)        private Integer year;
        @NotEmpty private List<EmpFigures> employees;
    }
    @Data public static class EmpFigures {
        @NotNull private UUID employeeId;
        @NotNull @DecimalMin("0.0") private BigDecimal baseSalary;
        private BigDecimal allowance;
        private BigDecimal deduction;
        private BigDecimal bonus;
    }
}
