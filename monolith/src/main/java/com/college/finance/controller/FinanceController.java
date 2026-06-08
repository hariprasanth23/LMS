package com.college.finance.controller;

import com.college.auth.model.User;
import com.college.common.dto.ApiResponse;
import com.college.finance.service.FinanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/finance")
@RequiredArgsConstructor
public class FinanceController {

    private final FinanceService service;

    @GetMapping("/fees")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getFees(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getFees(user)));
    }

    @GetMapping("/receipts")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getReceipts(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getReceipts(user)));
    }

    @GetMapping("/wallet")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getWallet(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getWallet(user)));
    }

    @PostMapping("/wallet/add")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> addToWallet(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {
        BigDecimal amount = new BigDecimal(body.get("amount").toString());
        String mode = body.getOrDefault("mode", "UPI").toString();
        return ResponseEntity.ok(ApiResponse.ok("Added to wallet", service.addToWallet(user, amount, mode)));
    }

    @GetMapping("/refunds")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getRefunds(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getRefunds(user)));
    }

    @PostMapping("/refunds")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> submitRefund(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {
        String feeType    = body.getOrDefault("feeType", "").toString();
        String reason     = body.getOrDefault("reason", "").toString();
        BigDecimal amount = new BigDecimal(body.getOrDefault("amount", "0").toString());
        String desc       = body.getOrDefault("description", "").toString();
        return ResponseEntity.ok(ApiResponse.ok("Refund request submitted", service.submitRefund(user, feeType, reason, amount, desc)));
    }
}
