package com.college.lms.controller;

import com.college.auth.model.User;
import com.college.common.dto.ApiResponse;
import com.college.lms.dto.AssignmentRequest;
import com.college.lms.dto.GradeRequest;
import com.college.lms.dto.SubmissionRequest;
import com.college.lms.model.Assignment;
import com.college.lms.model.AssignmentSubmission;
import com.college.lms.service.AssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @GetMapping("/api/courses/{courseId}/assignments")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<ApiResponse<List<Assignment>>> getByCourse(@PathVariable UUID courseId) {
        return ResponseEntity.ok(ApiResponse.ok(assignmentService.findByCourse(courseId)));
    }

    @PostMapping("/api/courses/{courseId}/assignments")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<ApiResponse<Assignment>> create(@PathVariable UUID courseId,
                                                          @Valid @RequestBody AssignmentRequest request) {
        Assignment assignment = assignmentService.create(courseId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Assignment created", assignment));
    }

    @PostMapping("/api/assignments/{id}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<AssignmentSubmission>> submit(@PathVariable UUID id,
                                                                     @Valid @RequestBody SubmissionRequest request,
                                                                     @AuthenticationPrincipal User currentUser) {
        AssignmentSubmission submission = assignmentService.submit(id, currentUser, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Submitted successfully", submission));
    }

    @GetMapping("/api/assignments/{id}/submissions")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<ApiResponse<List<AssignmentSubmission>>> getSubmissions(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(assignmentService.getSubmissions(id)));
    }

    @PutMapping("/api/assignments/submissions/{id}/grade")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<ApiResponse<AssignmentSubmission>> grade(@PathVariable UUID id,
                                                                    @Valid @RequestBody GradeRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Graded successfully", assignmentService.grade(id, request)));
    }
}
