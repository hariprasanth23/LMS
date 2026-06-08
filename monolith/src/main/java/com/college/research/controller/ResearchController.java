package com.college.research.controller;

import com.college.auth.model.User;
import com.college.common.dto.ApiResponse;
import com.college.research.service.ResearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/research")
@RequiredArgsConstructor
public class ResearchController {

    private final ResearchService service;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getProfile(user).orElse(null)));
    }

    @GetMapping("/weekly-logs")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getWeeklyLogs(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getWeeklyLogs(user)));
    }

    @PostMapping("/weekly-logs")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> submitLog(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(ApiResponse.ok("Log submitted", service.submitWeeklyLog(user, body)));
    }
}
