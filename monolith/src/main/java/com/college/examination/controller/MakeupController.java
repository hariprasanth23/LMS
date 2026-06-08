package com.college.examination.controller;

import com.college.auth.model.User;
import com.college.common.dto.ApiResponse;
import com.college.examination.dto.MakeupExamRequest;
import com.college.examination.service.ExaminationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/examination/makeup")
@RequiredArgsConstructor
public class MakeupController {

    private final ExaminationService service;

    @GetMapping("/applications")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getApplications(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getMakeupApplications(user)));
    }

    @PostMapping("/apply")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> apply(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody MakeupExamRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Application submitted", service.applyMakeup(user, req)));
    }
}
