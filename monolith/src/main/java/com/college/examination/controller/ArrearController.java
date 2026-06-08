package com.college.examination.controller;

import com.college.auth.model.User;
import com.college.common.dto.ApiResponse;
import com.college.examination.dto.ArrearRegistrationRequest;
import com.college.examination.service.ExaminationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/examination/arrear")
@RequiredArgsConstructor
public class ArrearController {

    private final ExaminationService service;

    @GetMapping("/eligible")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getEligible(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getEligibleArrearSubjects(user)));
    }

    @GetMapping("/registrations")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getRegistrations(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getArrearRegistrations(user)));
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> register(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ArrearRegistrationRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Registered successfully", service.registerArrear(user, req)));
    }

    @GetMapping("/schedule")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getSchedule(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getArrearSchedule(user)));
    }

    @GetMapping("/attempts")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getAttempts(@AuthenticationPrincipal User user) {
        // Grade history contains arrear attempt records
        return ResponseEntity.ok(ApiResponse.ok(service.getGradeHistory(user)));
    }
}
