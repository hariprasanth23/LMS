package com.lms.course.controller;

import com.lms.course.common.ApiResponse;
import com.lms.course.model.Assignment;
import com.lms.course.model.AssignmentSubmission;
import com.lms.course.repository.CourseRepositories.AssignmentRepository;
import com.lms.course.repository.CourseRepositories.AssignmentSubmissionRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentRepository assignmentRepo;
    private final AssignmentSubmissionRepository submissionRepo;

    @GetMapping("/api/courses/{courseId}/assignments")
    public ResponseEntity<ApiResponse<List<Assignment>>> byCourse(@PathVariable UUID courseId) {
        return ResponseEntity.ok(ApiResponse.success("OK", assignmentRepo.findByCourseIdOrderByDueDateAsc(courseId)));
    }

    @PostMapping("/api/courses/{courseId}/assignments")
    public ResponseEntity<ApiResponse<Assignment>> create(
            @RequestHeader("X-User-Role") String role,
            @PathVariable UUID courseId,
            @Valid @RequestBody AssignmentReq req) {
        requireAdminOrFaculty(role);
        Assignment saved = assignmentRepo.save(Assignment.builder()
                .courseId(courseId).title(req.getTitle()).description(req.getDescription())
                .dueDate(req.getDueDate()).maxMarks(req.getMaxMarks() != null ? req.getMaxMarks() : 100)
                .build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Assignment created", saved));
    }

    @PostMapping("/api/assignments/{id}/submit")
    public ResponseEntity<ApiResponse<AssignmentSubmission>> submit(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID id,
            @Valid @RequestBody SubmitReq req) {
        UUID studentId = UUID.fromString(userId);
        if (submissionRepo.findByAssignmentIdAndStudentId(id, studentId).isPresent())
            throw new IllegalStateException("Already submitted");
        AssignmentSubmission saved = submissionRepo.save(AssignmentSubmission.builder()
                .assignmentId(id).studentId(studentId).fileUrl(req.getFileUrl())
                .build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Submitted", saved));
    }

    @GetMapping("/api/assignments/{id}/submissions")
    public ResponseEntity<ApiResponse<List<AssignmentSubmission>>> listSubs(
            @RequestHeader("X-User-Role") String role, @PathVariable UUID id) {
        requireAdminOrFaculty(role);
        return ResponseEntity.ok(ApiResponse.success("OK", submissionRepo.findByAssignmentId(id)));
    }

    @PutMapping("/api/assignments/submissions/{id}/grade")
    public ResponseEntity<ApiResponse<AssignmentSubmission>> grade(
            @RequestHeader("X-User-Role") String role,
            @PathVariable UUID id, @Valid @RequestBody GradeReq req) {
        requireAdminOrFaculty(role);
        AssignmentSubmission s = submissionRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found"));
        s.setGradedMarks(req.getMarks());
        s.setFeedback(req.getFeedback());
        return ResponseEntity.ok(ApiResponse.success("Graded", submissionRepo.save(s)));
    }

    @Data public static class AssignmentReq {
        @NotBlank private String title;
        private String description;
        private Instant dueDate;
        private Integer maxMarks;
    }
    @Data public static class SubmitReq {
        private String fileUrl;
    }
    @Data public static class GradeReq {
        @jakarta.validation.constraints.NotNull private Integer marks;
        private String feedback;
    }

    private static void requireAdminOrFaculty(String role) {
        if (!"ADMIN".equals(role) && !"FACULTY".equals(role))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin or faculty role required");
    }
}
