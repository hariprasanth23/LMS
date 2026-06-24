package com.lms.feedback.controller;

import com.lms.feedback.common.ApiResponse;
import com.lms.feedback.model.CourseFeedback;
import com.lms.feedback.model.Feedback247;
import com.lms.feedback.repository.CourseFeedbackRepository;
import com.lms.feedback.repository.Feedback247Repository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final CourseFeedbackRepository courseRepo;
    private final Feedback247Repository    f247Repo;

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> status(@RequestHeader("X-User-Id") String userId) {
        UUID sid = UUID.fromString(userId);
        return ResponseEntity.ok(ApiResponse.success("OK",
                Map.of("courseFeedbackCount", courseRepo.findByStudentId(sid).size(),
                       "open247", f247Repo.findByStudentIdOrderBySubmittedAtDesc(sid).size())));
    }

    @PostMapping("/course")
    public ResponseEntity<ApiResponse<CourseFeedback>> submitCourse(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody CourseFeedbackReq req) {
        UUID sid = UUID.fromString(userId);
        if (courseRepo.existsByStudentIdAndCourseId(sid, req.getCourseId()))
            throw new IllegalStateException("Feedback for this course already submitted");
        CourseFeedback saved = courseRepo.save(CourseFeedback.builder()
                .studentId(sid).courseId(req.getCourseId())
                .rating(req.getRating()).comments(req.getComments())
                .build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Submitted", saved));
    }

    @GetMapping("/247")
    public ResponseEntity<ApiResponse<List<Feedback247>>> my247(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                f247Repo.findByStudentIdOrderBySubmittedAtDesc(UUID.fromString(userId))));
    }

    @PostMapping("/247")
    public ResponseEntity<ApiResponse<Feedback247>> submit247(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody F247Req req) {
        Feedback247 saved = f247Repo.save(Feedback247.builder()
                .studentId(req.isAnonymous() ? null : UUID.fromString(userId))
                .category(req.getCategory()).rating(req.getRating()).comments(req.getComments())
                .anonymous(req.isAnonymous()).build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Submitted", saved));
    }

    @Data
    public static class CourseFeedbackReq {
        @NotNull private UUID courseId;
        @NotNull @Min(1) @Max(5) private Integer rating;
        private String comments;
    }

    @Data
    public static class F247Req {
        private String category;
        @Min(1) @Max(5) private Integer rating;
        @NotBlank private String comments;
        private boolean anonymous;
    }
}
