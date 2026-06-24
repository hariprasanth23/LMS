package com.lms.course.controller;

import com.lms.course.common.ApiResponse;
import com.lms.course.model.Course;
import com.lms.course.model.CourseMaterial;
import com.lms.course.repository.CourseRepositories.CourseMaterialRepository;
import com.lms.course.repository.CourseRepositories.CourseRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseRepository      courseRepo;
    private final CourseMaterialRepository materialRepo;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Course>>> list(Pageable p) {
        return ResponseEntity.ok(ApiResponse.success("OK", courseRepo.findAll(p)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Course>> byId(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                courseRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Course not found"))));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Course>> create(
            @RequestHeader("X-User-Role") String role, @Valid @RequestBody CourseReq req) {
        requireAdminOrFaculty(role);
        if (courseRepo.existsByCode(req.getCode()))
            throw new IllegalStateException("Course code already exists");
        Course saved = courseRepo.save(Course.builder()
                .code(req.getCode()).name(req.getName()).description(req.getDescription())
                .departmentId(req.getDepartmentId()).credits(req.getCredits())
                .semester(req.getSemester()).facultyId(req.getFacultyId())
                .status("ACTIVE").build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Course created", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Course>> update(
            @RequestHeader("X-User-Role") String role, @PathVariable UUID id,
            @Valid @RequestBody CourseReq req) {
        requireAdminOrFaculty(role);
        Course c = courseRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Course not found"));
        c.setName(req.getName());
        c.setDescription(req.getDescription());
        c.setCredits(req.getCredits());
        c.setSemester(req.getSemester());
        c.setFacultyId(req.getFacultyId());
        return ResponseEntity.ok(ApiResponse.success("Course updated", courseRepo.save(c)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @RequestHeader("X-User-Role") String role, @PathVariable UUID id) {
        requireAdmin(role);
        courseRepo.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Course deleted"));
    }

    // ── Materials ───────────────────────────────────────────────────────────────

    @GetMapping("/{id}/materials")
    public ResponseEntity<ApiResponse<List<CourseMaterial>>> materials(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("OK", materialRepo.findByCourseIdOrderByCreatedAtDesc(id)));
    }

    @PostMapping("/{id}/materials")
    public ResponseEntity<ApiResponse<CourseMaterial>> addMaterial(
            @RequestHeader("X-User-Role") String role, @PathVariable UUID id,
            @Valid @RequestBody MaterialReq req) {
        requireAdminOrFaculty(role);
        CourseMaterial saved = materialRepo.save(CourseMaterial.builder()
                .courseId(id).title(req.getTitle()).description(req.getDescription())
                .url(req.getUrl()).type(req.getType()).build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Added", saved));
    }

    @DeleteMapping("/materials/{materialId}")
    public ResponseEntity<ApiResponse<Void>> deleteMaterial(
            @RequestHeader("X-User-Role") String role, @PathVariable UUID materialId) {
        requireAdminOrFaculty(role);
        materialRepo.deleteById(materialId);
        return ResponseEntity.ok(ApiResponse.success("Deleted"));
    }

    @Data public static class CourseReq {
        @NotBlank private String code;
        @NotBlank private String name;
        private String description;
        private Long departmentId;
        private Integer credits;
        private Integer semester;
        private UUID facultyId;
    }
    @Data public static class MaterialReq {
        @NotBlank private String title;
        private String description;
        private String url;
        private String type;
    }

    private static void requireAdmin(String role) {
        if (!"ADMIN".equals(role)) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin role required");
    }
    private static void requireAdminOrFaculty(String role) {
        if (!"ADMIN".equals(role) && !"FACULTY".equals(role))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin or faculty role required");
    }
}
