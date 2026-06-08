package com.college.services.controller;

import com.college.auth.model.User;
import com.college.common.dto.ApiResponse;
import com.college.services.service.ServicesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServicesController {

    private final ServicesService service;

    // ── Bonafide ──────────────────────────────────────────────────────────────────

    @GetMapping("/bonafide")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getBonafide(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getBonafideApplications(user)));
    }

    @PostMapping("/bonafide")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> applyBonafide(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(ApiResponse.ok("Application submitted",
                service.applyBonafide(user,
                        str(body, "purpose"), str(body, "addressedTo"),
                        str(body, "description"), str(body, "language"),
                        body.get("copies") != null ? Integer.parseInt(body.get("copies").toString()) : 1,
                        str(body, "urgency"))));
    }

    // ── Library ───────────────────────────────────────────────────────────────────

    @GetMapping("/library/issued")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getIssuedBooks(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getIssuedBooks(user)));
    }

    @PostMapping("/library/renew/{bookId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> renewBook(
            @AuthenticationPrincipal User user,
            @PathVariable UUID bookId) {
        return ResponseEntity.ok(ApiResponse.ok("Book renewed", service.renewBook(user, bookId)));
    }

    @GetMapping("/library/recommendations")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getRecommendations(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getRecommendations(user)));
    }

    @PostMapping("/library/recommend")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> recommend(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(ApiResponse.ok("Recommendation submitted",
                service.recommendBook(user,
                        str(body, "title"), str(body, "author"),
                        str(body, "publisher"), str(body, "isbn"),
                        str(body, "category"), str(body, "reason"))));
    }

    @GetMapping("/library/stats")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getStats(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getLibraryStats(user)));
    }

    private String str(Map<String, Object> map, String key) {
        Object v = map.get(key);
        return v != null ? v.toString() : null;
    }
}
