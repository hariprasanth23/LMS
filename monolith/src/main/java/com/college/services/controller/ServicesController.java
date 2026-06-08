package com.college.services.controller;

import com.college.auth.model.User;
import com.college.common.dto.ApiResponse;
import com.college.services.model.HealthFeedback;
import com.college.services.model.StudentServiceRequest;
import com.college.services.repository.HealthFeedbackRepository;
import com.college.services.repository.StudentServiceRequestRepository;
import com.college.services.service.ServicesService;
import com.college.student.model.Student;
import com.college.student.repository.StudentRepository;
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
    private final StudentRepository studentRepository;
    private final StudentServiceRequestRepository serviceRequestRepository;
    private final HealthFeedbackRepository healthFeedbackRepository;

    // ── Bonafide ──────────────────────────────────────────────────────────────────

    @GetMapping("/bonafide")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getBonafide(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getBonafideApplications(user)));
    }

    @PostMapping("/bonafide")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> applyBonafide(@AuthenticationPrincipal User user, @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(ApiResponse.ok("Application submitted",
                service.applyBonafide(user,
                        str(body, "purpose"), str(body, "addressedTo"), str(body, "description"),
                        str(body, "language"),
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
    public ResponseEntity<ApiResponse<?>> renewBook(@AuthenticationPrincipal User user, @PathVariable UUID bookId) {
        return ResponseEntity.ok(ApiResponse.ok("Book renewed", service.renewBook(user, bookId)));
    }

    @GetMapping("/library/recommendations")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getRecommendations(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getRecommendations(user)));
    }

    @PostMapping("/library/recommend")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> recommend(@AuthenticationPrincipal User user, @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(ApiResponse.ok("Recommendation submitted",
                service.recommendBook(user, str(body, "title"), str(body, "author"),
                        str(body, "publisher"), str(body, "isbn"), str(body, "category"), str(body, "reason"))));
    }

    @GetMapping("/library/stats")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getStats(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getLibraryStats(user)));
    }

    // ── Generic Student Service Requests ─────────────────────────────────────────

    @GetMapping("/requests")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getAllRequests(@AuthenticationPrincipal User user) {
        Student student = studentRepository.findByUserId(user.getId()).orElse(null);
        if (student == null) return ResponseEntity.ok(ApiResponse.ok(java.util.List.of()));
        return ResponseEntity.ok(ApiResponse.ok(
                serviceRequestRepository.findByStudentIdOrderBySubmittedAtDesc(student.getId())));
    }

    @GetMapping("/requests/{type}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getRequestsByType(
            @AuthenticationPrincipal User user, @PathVariable String type) {
        Student student = studentRepository.findByUserId(user.getId()).orElse(null);
        if (student == null) return ResponseEntity.ok(ApiResponse.ok(java.util.List.of()));
        return ResponseEntity.ok(ApiResponse.ok(
                serviceRequestRepository.findByStudentIdAndRequestTypeOrderBySubmittedAtDesc(student.getId(), type)));
    }

    @PostMapping("/requests")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> submitRequest(
            @AuthenticationPrincipal User user, @RequestBody Map<String, Object> body) {
        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException("Student profile not found"));
        String reqType = body.getOrDefault("requestType", "GENERAL").toString();
        String reqNum  = reqType.substring(0, Math.min(3, reqType.length())).toUpperCase() + System.currentTimeMillis() % 100000;
        StudentServiceRequest req = serviceRequestRepository.save(StudentServiceRequest.builder()
                .studentId(student.getId())
                .requestType(reqType)
                .requestNumber(reqNum)
                .details(str(body, "details"))
                .status("Pending").build());
        return ResponseEntity.ok(ApiResponse.ok("Request submitted", req));
    }

    // ── Health Feedback ───────────────────────────────────────────────────────────

    @GetMapping("/health-feedback")
    public ResponseEntity<ApiResponse<?>> getHealthFeedback(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(
                healthFeedbackRepository.findByUserIdOrderBySubmittedAtDesc(user.getId())));
    }

    @PostMapping("/health-feedback")
    public ResponseEntity<ApiResponse<?>> submitHealthFeedback(
            @AuthenticationPrincipal User user, @RequestBody Map<String, Object> body) {
        HealthFeedback hf = healthFeedbackRepository.save(HealthFeedback.builder()
                .userId(body.get("anonymous") != null && Boolean.parseBoolean(body.get("anonymous").toString())
                        ? null : user.getId())
                .visitReason(str(body, "visitReason"))
                .doctorRating(intVal(body, "doctorRating"))
                .facilityRating(intVal(body, "facilityRating"))
                .waitTimeRating(intVal(body, "waitTimeRating"))
                .comments(str(body, "comments"))
                .anonymous(body.get("anonymous") == null || Boolean.parseBoolean(body.get("anonymous").toString()))
                .build());
        return ResponseEntity.ok(ApiResponse.ok("Feedback submitted", hf));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────────

    private String str(Map<String, Object> map, String key) {
        Object v = map.get(key); return v != null ? v.toString() : null;
    }

    private Integer intVal(Map<String, Object> map, String key) {
        Object v = map.get(key); return v != null ? Integer.parseInt(v.toString()) : null;
    }
}
