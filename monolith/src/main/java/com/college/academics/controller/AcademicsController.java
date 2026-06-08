package com.college.academics.controller;

import com.college.academics.service.AcademicsService;
import com.college.auth.model.User;
import com.college.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/academics")
@RequiredArgsConstructor
public class AcademicsController {

    private final AcademicsService service;

    // ── Wishlist ──────────────────────────────────────────────────────────────────

    @GetMapping("/wishlist")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getWishlist(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getWishlist(user)));
    }

    @PostMapping("/wishlist")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> addToWishlist(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(ApiResponse.ok("Added to wishlist", service.addToWishlist(user, body)));
    }

    @DeleteMapping("/wishlist/{courseCode}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> removeFromWishlist(
            @AuthenticationPrincipal User user,
            @PathVariable String courseCode) {
        service.removeFromWishlist(user, courseCode);
        return ResponseEntity.ok(ApiResponse.ok("Removed from wishlist", null));
    }

    // ── Open Projects ─────────────────────────────────────────────────────────────

    @GetMapping("/projects/open")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getOpenProjects(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getOpenProjects(user)));
    }

    @PostMapping("/projects/apply")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> applyForProject(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {
        Long id = Long.parseLong(body.get("projectId").toString());
        String title   = body.getOrDefault("title", "").toString();
        String faculty = body.getOrDefault("faculty", "").toString();
        return ResponseEntity.ok(ApiResponse.ok("Application submitted", service.applyForProject(user, id, title, faculty)));
    }

    @GetMapping("/projects/applications")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getMyApplications(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getMyProjectApplications(user)));
    }
}
