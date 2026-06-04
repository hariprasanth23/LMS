package com.college.payroll.controller;

import com.college.common.dto.ApiResponse;
import com.college.payroll.dto.PayrollGenerateRequest;
import com.college.payroll.dto.PayrollResponse;
import com.college.payroll.service.PayrollService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    @PostMapping("/generate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<PayrollResponse>>> generate(
            @Valid @RequestBody PayrollGenerateRequest request) {
        List<PayrollResponse> records = payrollService.generatePayroll(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Payroll generated for " + records.size() + " employees", records));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<PayrollResponse>>> getAll(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(ApiResponse.ok(payrollService.getAll(month, year)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<PayrollResponse>>> getMyPayslips() {
        return ResponseEntity.ok(ApiResponse.ok(payrollService.getMyPayslips()));
    }

    @PutMapping("/{id}/process")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PayrollResponse>> process(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok("Payroll processed", payrollService.process(id)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PayrollResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(payrollService.getById(id)));
    }
}
