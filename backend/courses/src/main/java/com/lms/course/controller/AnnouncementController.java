package com.lms.course.controller;

import com.lms.course.common.ApiResponse;
import com.lms.course.model.Announcement;
import com.lms.course.repository.CourseRepositories.AnnouncementRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementRepository repo;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Announcement>>> all() {
        return ResponseEntity.ok(ApiResponse.success("OK", repo.findAllByOrderByCreatedAtDesc()));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<List<Announcement>>> byCourse(@PathVariable UUID courseId) {
        return ResponseEntity.ok(ApiResponse.success("OK", repo.findByCourseIdOrderByCreatedAtDesc(courseId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Announcement>> create(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody Req req) {
        requireAdminOrFaculty(role);
        Announcement saved = repo.save(Announcement.builder()
                .courseId(req.getCourseId()).title(req.getTitle())
                .content(req.getContent()).createdBy(UUID.fromString(userId))
                .build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Created", saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @RequestHeader("X-User-Role") String role, @PathVariable UUID id) {
        requireAdminOrFaculty(role);
        repo.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted"));
    }

    @Data public static class Req {
        private UUID courseId;
        @NotBlank private String title;
        @NotBlank private String content;
    }

    private static void requireAdminOrFaculty(String role) {
        if (!"ADMIN".equals(role) && !"FACULTY".equals(role))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin or faculty role required");
    }
}
