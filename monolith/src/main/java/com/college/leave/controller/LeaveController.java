package com.college.leave.controller;

import com.college.common.dto.ApiResponse;
import com.college.leave.dto.LeaveRequestDto;
import com.college.leave.dto.LeaveRequestResponse;
import com.college.leave.dto.LeaveReviewDto;
import com.college.leave.model.LeaveBalance;
import com.college.leave.service.LeaveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STAFF')")
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> apply(@Valid @RequestBody LeaveRequestDto dto) {
        LeaveRequestResponse resp = leaveService.apply(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Leave request submitted", resp));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STAFF')")
    public ResponseEntity<ApiResponse<List<LeaveRequestResponse>>> getMyRequests() {
        return ResponseEntity.ok(ApiResponse.ok(leaveService.getMyRequests()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<ApiResponse<List<LeaveRequestResponse>>> getAllRequests() {
        return ResponseEntity.ok(ApiResponse.ok(leaveService.getAllRequests()));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> approve(
            @PathVariable UUID id,
            @RequestBody(required = false) LeaveReviewDto reviewDto) {
        return ResponseEntity.ok(ApiResponse.ok("Leave approved", leaveService.approve(id, reviewDto)));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> reject(
            @PathVariable UUID id,
            @RequestBody(required = false) LeaveReviewDto reviewDto) {
        return ResponseEntity.ok(ApiResponse.ok("Leave rejected", leaveService.reject(id, reviewDto)));
    }

    @GetMapping("/balance")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STAFF')")
    public ResponseEntity<ApiResponse<LeaveBalance>> getBalance() {
        return ResponseEntity.ok(ApiResponse.ok(leaveService.getBalance()));
    }
}
