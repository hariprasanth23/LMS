package com.lms.hr.controller;

import com.lms.hr.common.ApiResponse;
import com.lms.hr.model.LeaveBalance;
import com.lms.hr.model.LeaveRequest;
import com.lms.hr.repository.HrRepositories.LeaveBalanceRepository;
import com.lms.hr.repository.HrRepositories.LeaveRequestRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveRequestRepository requestRepo;
    private final LeaveBalanceRepository balanceRepo;

    @PostMapping
    public ResponseEntity<ApiResponse<LeaveRequest>> apply(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody LeaveReq req) {
        LeaveRequest saved = requestRepo.save(LeaveRequest.builder()
                .employeeId(UUID.fromString(userId))
                .leaveType(req.getLeaveType())
                .fromDate(req.getFromDate()).toDate(req.getToDate())
                .reason(req.getReason()).status("PENDING")
                .build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Submitted", saved));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<LeaveRequest>>> mine(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                requestRepo.findByEmployeeIdOrderByCreatedAtDesc(UUID.fromString(userId))));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LeaveRequest>>> all(@RequestHeader("X-User-Role") String role) {
        requireAdmin(role);
        return ResponseEntity.ok(ApiResponse.success("OK", requestRepo.findAllByOrderByCreatedAtDesc()));
    }

    @PutMapping("/{id}/approve")
    @Transactional
    public ResponseEntity<ApiResponse<LeaveRequest>> approve(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") String reviewerId,
            @PathVariable UUID id,
            @RequestBody(required = false) ReviewReq body) {
        requireAdmin(role);
        return ResponseEntity.ok(ApiResponse.success("Approved", review(id, "APPROVED", reviewerId, body)));
    }

    @PutMapping("/{id}/reject")
    @Transactional
    public ResponseEntity<ApiResponse<LeaveRequest>> reject(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") String reviewerId,
            @PathVariable UUID id,
            @RequestBody(required = false) ReviewReq body) {
        requireAdmin(role);
        return ResponseEntity.ok(ApiResponse.success("Rejected", review(id, "REJECTED", reviewerId, body)));
    }

    @GetMapping("/balance")
    public ResponseEntity<ApiResponse<List<LeaveBalance>>> balance(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                balanceRepo.findByEmployeeIdAndYear(UUID.fromString(userId), LocalDate.now().getYear())));
    }

    private LeaveRequest review(UUID id, String newStatus, String reviewerId, ReviewReq body) {
        LeaveRequest r = requestRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found"));
        r.setStatus(newStatus);
        r.setReviewedBy(UUID.fromString(reviewerId));
        if (body != null) r.setReviewNote(body.getReviewNote());
        return requestRepo.save(r);
    }

    private static void requireAdmin(String role) {
        if (!"ADMIN".equals(role)) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin role required");
    }

    @Data public static class LeaveReq {
        @NotBlank private String leaveType;
        @NotNull  private LocalDate fromDate;
        @NotNull  private LocalDate toDate;
        private String reason;
    }
    @Data public static class ReviewReq { private String reviewNote; }
}
