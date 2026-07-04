package com.lms.academics.controller;

import com.lms.academics.common.ApiResponse;
import com.lms.academics.model.Entities.*;
import com.lms.academics.repository.AcademicsRepositories.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/academics")
@RequiredArgsConstructor
public class AcademicsController {

    private final CourseWishlistRepository wishlistRepo;
    private final ExcRegistrationRepository excRepo;
    private final MoocRepository moocRepo;
    private final InternshipRepository internshipRepo;
    private final ConferenceRepository conferenceRepo;
    private final ProjectApplicationRepository projectRepo;

    // ── Wishlist ───────────────────────────────────────────────────────────────

    @GetMapping("/wishlist")
    public ResponseEntity<ApiResponse<List<CourseWishlist>>> wishlist(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK", wishlistRepo.findByStudentId(UUID.fromString(userId))));
    }

    @PostMapping("/wishlist")
    public ResponseEntity<ApiResponse<CourseWishlist>> addToWishlist(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody WishlistReq req) {
        UUID sid = UUID.fromString(userId);
        if (wishlistRepo.findByStudentIdAndCourseCode(sid, req.getCourseCode()).isPresent())
            throw new IllegalStateException("Already in wishlist");
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Added",
                wishlistRepo.save(CourseWishlist.builder().studentId(sid).courseCode(req.getCourseCode()).build())));
    }

    @DeleteMapping("/wishlist/{courseCode}")
    public ResponseEntity<ApiResponse<Void>> removeFromWishlist(
            @RequestHeader("X-User-Id") String userId, @PathVariable String courseCode) {
        wishlistRepo.findByStudentIdAndCourseCode(UUID.fromString(userId), courseCode)
                .ifPresent(wishlistRepo::delete);
        return ResponseEntity.ok(ApiResponse.success("Removed"));
    }

    // ── Registered courses ─────────────────────────────────────────────────────

    @GetMapping("/courses/registered")
    public ResponseEntity<ApiResponse<List<Object>>> registered() {
        // Cross-service: would call course-service/api/enrollments/student/{id}.
        // Returning [] for v2 minimal; frontend handles empty.
        return ResponseEntity.ok(ApiResponse.success("OK", List.of()));
    }

    // ── EXC ────────────────────────────────────────────────────────────────────

    @GetMapping("/exc/available")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> excAvailable() {
        return ResponseEntity.ok(ApiResponse.success("OK", List.of(
                Map.of("name", "Sports Club",     "type", "SPORTS"),
                Map.of("name", "Coding Society",  "type", "TECHNICAL"),
                Map.of("name", "Music Club",      "type", "CULTURAL"))));
    }

    @PostMapping("/exc/register")
    public ResponseEntity<ApiResponse<ExcRegistration>> excRegister(
            @RequestHeader("X-User-Id") String userId, @Valid @RequestBody ExcReq req) {
        ExcRegistration saved = excRepo.save(ExcRegistration.builder()
                .studentId(UUID.fromString(userId))
                .activityName(req.getActivityName()).activityType(req.getActivityType())
                .status("REGISTERED").build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Registered", saved));
    }

    @GetMapping("/exc/registered")
    public ResponseEntity<ApiResponse<List<ExcRegistration>>> excRegistered(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK", excRepo.findByStudentId(UUID.fromString(userId))));
    }

    // ── MOOC ───────────────────────────────────────────────────────────────────

    @PostMapping("/mooc")
    public ResponseEntity<ApiResponse<MoocSubmission>> moocSubmit(
            @RequestHeader("X-User-Id") String userId, @Valid @RequestBody MoocReq req) {
        MoocSubmission saved = moocRepo.save(MoocSubmission.builder()
                .studentId(UUID.fromString(userId)).courseName(req.getCourseName())
                .platform(req.getPlatform()).duration(req.getDuration())
                .certificateUrl(req.getCertificateUrl()).status("PENDING").build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Submitted", saved));
    }

    @GetMapping("/mooc")
    public ResponseEntity<ApiResponse<List<MoocSubmission>>> moocList(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                moocRepo.findByStudentIdOrderBySubmittedAtDesc(UUID.fromString(userId))));
    }

    // ── Internship ─────────────────────────────────────────────────────────────

    @PostMapping("/internship")
    public ResponseEntity<ApiResponse<InternshipRegistration>> intern(
            @RequestHeader("X-User-Id") String userId, @Valid @RequestBody InternReq req) {
        InternshipRegistration saved = internshipRepo.save(InternshipRegistration.builder()
                .studentId(UUID.fromString(userId)).companyName(req.getCompanyName())
                .role(req.getRole()).startDate(req.getStartDate()).endDate(req.getEndDate())
                .stipend(req.getStipend()).status("REGISTERED").build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Registered", saved));
    }

    @GetMapping("/internship")
    public ResponseEntity<ApiResponse<List<InternshipRegistration>>> internList(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                internshipRepo.findByStudentIdOrderByCreatedAtDesc(UUID.fromString(userId))));
    }

    // ── Conference ─────────────────────────────────────────────────────────────

    @PostMapping("/conference")
    public ResponseEntity<ApiResponse<ConferenceRegistration>> conference(
            @RequestHeader("X-User-Id") String userId, @Valid @RequestBody ConfReq req) {
        ConferenceRegistration saved = conferenceRepo.save(ConferenceRegistration.builder()
                .studentId(UUID.fromString(userId)).conferenceName(req.getConferenceName())
                .organizer(req.getOrganizer()).conferenceDate(req.getConferenceDate())
                .paperTitle(req.getPaperTitle()).status("REGISTERED").build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Registered", saved));
    }

    @GetMapping("/conference")
    public ResponseEntity<ApiResponse<List<ConferenceRegistration>>> conferenceList(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                conferenceRepo.findByStudentIdOrderByCreatedAtDesc(UUID.fromString(userId))));
    }

    // ── Projects ───────────────────────────────────────────────────────────────

    @GetMapping("/projects/open")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> openProjects() {
        return ResponseEntity.ok(ApiResponse.success("OK", List.of()));   // catalog lives elsewhere
    }

    @PostMapping("/projects/apply")
    public ResponseEntity<ApiResponse<ProjectApplication>> applyProject(
            @RequestHeader("X-User-Id") String userId, @Valid @RequestBody ProjReq req) {
        ProjectApplication saved = projectRepo.save(ProjectApplication.builder()
                .studentId(UUID.fromString(userId)).projectTitle(req.getProjectTitle())
                .supervisorId(req.getSupervisorId()).description(req.getDescription())
                .status("PENDING").build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Applied", saved));
    }

    @GetMapping("/projects/applications")
    public ResponseEntity<ApiResponse<List<ProjectApplication>>> myProjectApps(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                projectRepo.findByStudentIdOrderByAppliedAtDesc(UUID.fromString(userId))));
    }

    // ── Registration schedule ─────────────────────────────────────────────────

    @GetMapping("/registration-schedule")
    public ResponseEntity<ApiResponse<Map<String, Object>>> regSchedule() {
        return ResponseEntity.ok(ApiResponse.success("OK", Map.of(
                "open", false, "message", "Course registration not currently open")));
    }

    // ── Request DTOs ───────────────────────────────────────────────────────────

    @Data public static class WishlistReq {
        @NotBlank private String courseCode;
        private String courseName;
        private Integer credits;
    }
    @Data public static class ExcReq {
        @NotBlank private String activityName;
        private String activityType;
    }
    @Data public static class MoocReq {
        @NotBlank private String courseName;
        private String platform;
        private String duration;
        private String certificateUrl;
        private String completionDate;
    }
    @Data public static class InternReq {
        @NotBlank private String companyName;
        private String role;
        private LocalDate startDate;
        private LocalDate endDate;
        private BigDecimal stipend;
        private String description;
    }
    @Data public static class ConfReq {
        @NotBlank private String conferenceName;
        private String organizer;
        private LocalDate conferenceDate;
        @JsonAlias("date") private LocalDate date;   // accept either
        private String paperTitle;
        private String venue;
    }
    @Data public static class ProjReq {
        @NotBlank private String projectTitle;
        private UUID supervisorId;
        private String description;
    }

    // Lightweight alias annotation — Jackson handles via @JsonAlias on field.
    @java.lang.annotation.Retention(java.lang.annotation.RetentionPolicy.RUNTIME)
    @java.lang.annotation.Target(java.lang.annotation.ElementType.FIELD)
    public @interface JsonAlias {
        String value();
    }
}
