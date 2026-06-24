package com.lms.studentservices.controller;

import com.lms.studentservices.common.ApiResponse;
import com.lms.studentservices.model.Entities.*;
import com.lms.studentservices.repository.Repositories.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServicesController {

    private final BonafideRepository           bonafideRepo;
    private final LibraryBookRepository        bookRepo;
    private final BookRecommendationRepository recRepo;
    private final ServiceRequestRepository     requestRepo;
    private final HealthFeedbackRepository     healthRepo;

    // ── Bonafide ───────────────────────────────────────────────────────────────

    @GetMapping("/bonafide")
    public ResponseEntity<ApiResponse<List<BonafideApplication>>> bonafide(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                bonafideRepo.findByStudentIdOrderByCreatedAtDesc(UUID.fromString(userId))));
    }

    @PostMapping("/bonafide")
    public ResponseEntity<ApiResponse<BonafideApplication>> applyBonafide(
            @RequestHeader("X-User-Id") String userId, @Valid @RequestBody BonafideReq req) {
        BonafideApplication saved = bonafideRepo.save(BonafideApplication.builder()
                .studentId(UUID.fromString(userId)).purpose(req.getPurpose())
                .addressedTo(req.getAddressedTo())
                .language(req.getLanguage() != null ? req.getLanguage() : "ENGLISH")
                .copies(req.getCopies() != null ? req.getCopies() : 1)
                .urgency(req.getUrgency() != null ? req.getUrgency() : "NORMAL")
                .status("PENDING").build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Applied", saved));
    }

    // ── Library ────────────────────────────────────────────────────────────────

    @GetMapping("/library/issued")
    public ResponseEntity<ApiResponse<List<LibraryBook>>> issued(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK", bookRepo.findByIssuedToStudent(UUID.fromString(userId))));
    }

    @PostMapping("/library/renew/{bookId}")
    @Transactional
    public ResponseEntity<ApiResponse<LibraryBook>> renew(
            @RequestHeader("X-User-Id") String userId, @PathVariable UUID bookId) {
        LibraryBook book = bookRepo.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));
        if (book.getIssuedToStudent() == null || !book.getIssuedToStudent().equals(UUID.fromString(userId)))
            throw new IllegalStateException("Book is not issued to you");
        book.setDueDate(LocalDate.now().plusWeeks(2));
        return ResponseEntity.ok(ApiResponse.success("Renewed", bookRepo.save(book)));
    }

    @GetMapping("/library/recommendations")
    public ResponseEntity<ApiResponse<List<BookRecommendation>>> recommendations(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                recRepo.findByStudentIdOrderByCreatedAtDesc(UUID.fromString(userId))));
    }

    @PostMapping("/library/recommend")
    public ResponseEntity<ApiResponse<BookRecommendation>> recommend(
            @RequestHeader("X-User-Id") String userId, @Valid @RequestBody RecReq req) {
        BookRecommendation saved = recRepo.save(BookRecommendation.builder()
                .studentId(UUID.fromString(userId))
                .bookTitle(req.getTitle()).author(req.getAuthor()).publisher(req.getPublisher())
                .isbn(req.getIsbn()).category(req.getCategory()).reason(req.getReason())
                .status("PENDING").build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Submitted", saved));
    }

    @GetMapping("/library/stats")
    public ResponseEntity<ApiResponse<Map<String, Long>>> libraryStats() {
        return ResponseEntity.ok(ApiResponse.success("OK", Map.of(
                "total",        bookRepo.count(),
                "available",    bookRepo.countByAvailabilityStatus("AVAILABLE"),
                "issued",       bookRepo.countByAvailabilityStatus("ISSUED"))));
    }

    // ── Requests ───────────────────────────────────────────────────────────────

    @GetMapping("/requests")
    public ResponseEntity<ApiResponse<List<ServiceRequest>>> requests(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                requestRepo.findByStudentIdOrderBySubmittedAtDesc(UUID.fromString(userId))));
    }

    @GetMapping("/requests/{type}")
    public ResponseEntity<ApiResponse<List<ServiceRequest>>> requestsByType(
            @RequestHeader("X-User-Id") String userId, @PathVariable String type) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                requestRepo.findByStudentIdAndRequestTypeOrderBySubmittedAtDesc(
                        UUID.fromString(userId), type.toUpperCase())));
    }

    @PostMapping("/requests")
    public ResponseEntity<ApiResponse<ServiceRequest>> submitRequest(
            @RequestHeader("X-User-Id") String userId, @Valid @RequestBody RequestReq req) {
        ServiceRequest saved = requestRepo.save(ServiceRequest.builder()
                .studentId(UUID.fromString(userId)).requestType(req.getType().toUpperCase())
                .requestNumber("REQ-" + System.currentTimeMillis())
                .details(req.getDescription()).status("OPEN").build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Submitted", saved));
    }

    // ── Health feedback ────────────────────────────────────────────────────────

    @GetMapping("/health-feedback")
    public ResponseEntity<ApiResponse<List<HealthFeedback>>> health(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                healthRepo.findByUserIdOrderBySubmittedAtDesc(UUID.fromString(userId))));
    }

    @PostMapping("/health-feedback")
    public ResponseEntity<ApiResponse<HealthFeedback>> submitHealth(
            @RequestHeader("X-User-Id") String userId, @Valid @RequestBody HealthReq req) {
        HealthFeedback saved = healthRepo.save(HealthFeedback.builder()
                .userId(req.isAnonymous() ? null : UUID.fromString(userId))
                .visitReason(req.getVisitReason())
                .doctorRating(req.getDoctorRating())
                .facilityRating(req.getFacilityRating())
                .waitTimeRating(req.getWaitTimeRating())
                .comments(req.getComments())
                .anonymous(req.isAnonymous()).build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Submitted", saved));
    }

    // ── DTOs ───────────────────────────────────────────────────────────────────

    @Data public static class BonafideReq {
        @NotBlank private String purpose;
        private String addressedTo;
        private String language;
        private Integer copies;
        private String urgency;
        private Boolean addressRequired;
    }
    @Data public static class RecReq {
        @NotBlank private String title;
        private String author;
        private String publisher;
        private String isbn;
        private String category;
        private String reason;
    }
    @Data public static class RequestReq {
        @NotBlank private String type;
        @NotBlank private String description;
    }
    @Data public static class HealthReq {
        private String visitReason;
        @Min(1) @Max(5) private Integer rating;    // backward compat single-rating
        @Min(1) @Max(5) private Integer doctorRating;
        @Min(1) @Max(5) private Integer facilityRating;
        @Min(1) @Max(5) private Integer waitTimeRating;
        private String comments;
        private boolean anonymous;
    }
}
