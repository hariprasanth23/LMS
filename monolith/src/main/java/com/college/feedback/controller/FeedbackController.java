package com.college.feedback.controller;

import com.college.auth.model.User;
import com.college.common.dto.ApiResponse;
import com.college.feedback.dto.CourseFeedbackRequest;
import com.college.feedback.dto.Feedback247Request;
import com.college.feedback.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService service;

    @GetMapping("/status")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getStatus(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getFeedbackStatus(user)));
    }

    @PostMapping("/course")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> submitCourse(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CourseFeedbackRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Feedback submitted", service.submitCourseFeedback(user, req)));
    }

    @GetMapping("/247")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> get247(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getMy247Feedbacks(user)));
    }

    @PostMapping("/247")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> submit247(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody Feedback247Request req) {
        return ResponseEntity.ok(ApiResponse.ok("Feedback submitted", service.submit247Feedback(user, req)));
    }
}
