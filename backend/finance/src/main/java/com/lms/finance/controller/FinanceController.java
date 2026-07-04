package com.lms.finance.controller;

import com.lms.finance.common.ApiResponse;
import com.lms.finance.model.*;
import com.lms.finance.repository.FinanceRepositories.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/finance")
@RequiredArgsConstructor
public class FinanceController {

    private final FeeRecordRepository          feeRepo;
    private final PaymentReceiptRepository     receiptRepo;
    private final WalletTransactionRepository  walletRepo;
    private final RefundRequestRepository      refundRepo;

    @GetMapping("/fees")
    public ResponseEntity<ApiResponse<List<FeeRecord>>> fees(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                feeRepo.findByStudentIdOrderByDueDateAsc(UUID.fromString(userId))));
    }

    @GetMapping("/receipts")
    public ResponseEntity<ApiResponse<List<PaymentReceipt>>> receipts(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                receiptRepo.findByStudentIdOrderByPaidAtDesc(UUID.fromString(userId))));
    }

    @GetMapping("/wallet")
    public ResponseEntity<ApiResponse<Map<String, Object>>> wallet(@RequestHeader("X-User-Id") String userId) {
        UUID sid = UUID.fromString(userId);
        return ResponseEntity.ok(ApiResponse.success("OK", Map.of(
                "balance", walletRepo.currentBalance(sid),
                "transactions", walletRepo.findByStudentIdOrderByCreatedAtDesc(sid))));
    }

    @PostMapping("/wallet/add")
    @Transactional
    public ResponseEntity<ApiResponse<WalletTransaction>> addToWallet(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody WalletReq req) {
        WalletTransaction saved = walletRepo.save(WalletTransaction.builder()
                .studentId(UUID.fromString(userId))
                .type("CREDIT").amount(req.getAmount())
                .description(req.getDescription())
                .build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Added", saved));
    }

    @GetMapping("/refunds")
    public ResponseEntity<ApiResponse<List<RefundRequest>>> refunds(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                refundRepo.findByStudentIdOrderByCreatedAtDesc(UUID.fromString(userId))));
    }

    @PostMapping("/refunds")
    public ResponseEntity<ApiResponse<RefundRequest>> requestRefund(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody RefundReq req) {
        RefundRequest saved = refundRepo.save(RefundRequest.builder()
                .studentId(UUID.fromString(userId)).amount(req.getAmount())
                .reason(req.getReason()).status("PENDING").build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Requested", saved));
    }

    @Data
    public static class WalletReq {
        @NotNull @DecimalMin("0.01") private BigDecimal amount;
        private String description;
    }
    @Data
    public static class RefundReq {
        @NotNull @DecimalMin("0.01") private BigDecimal amount;
        @NotBlank private String reason;
        private String feeType;
    }
}
