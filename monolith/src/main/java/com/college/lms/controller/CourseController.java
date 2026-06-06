package com.college.lms.controller;

import com.college.common.dto.ApiResponse;
import com.college.lms.dto.CourseRequest;
import com.college.lms.dto.CourseMaterialRequest;
import com.college.lms.model.Course;
import com.college.lms.model.CourseMaterial;
import com.college.lms.service.CourseService;
import com.college.lms.service.CourseMaterialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;
    private final CourseMaterialService materialService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<ApiResponse<List<Course>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(courseService.findAll()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<ApiResponse<Course>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(courseService.findById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<ApiResponse<Course>> create(@Valid @RequestBody CourseRequest request) {
        Course created = courseService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Course created", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<ApiResponse<Course>> update(@PathVariable UUID id,
                                                      @Valid @RequestBody CourseRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Course updated", courseService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        courseService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Course deleted", null));
    }

    @GetMapping("/{id}/materials")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<ApiResponse<List<CourseMaterial>>> getMaterials(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(materialService.findByCourse(id)));
    }

    @PostMapping("/{id}/materials")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<ApiResponse<CourseMaterial>> addMaterial(@PathVariable UUID id,
                                                                    @Valid @RequestBody CourseMaterialRequest request) {
        CourseMaterial material = materialService.addMaterial(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Material added", material));
    }

    @DeleteMapping("/materials/{materialId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<ApiResponse<Void>> deleteMaterial(@PathVariable UUID materialId) {
        materialService.deleteMaterial(materialId);
        return ResponseEntity.ok(ApiResponse.ok("Material deleted", null));
    }
}
