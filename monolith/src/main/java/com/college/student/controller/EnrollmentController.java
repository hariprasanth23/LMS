package com.college.student.controller;

import com.college.common.dto.ApiResponse;
import com.college.student.dto.EnrollmentRequest;
import com.college.student.model.Enrollment;
import com.college.student.service.EnrollmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<ApiResponse<Enrollment>> enroll(@Valid @RequestBody EnrollmentRequest request) {
        Enrollment enrollment = enrollmentService.enroll(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Enrolled successfully", enrollment));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<ApiResponse<List<Enrollment>>> getByStudent(@PathVariable UUID studentId) {
        return ResponseEntity.ok(ApiResponse.ok(enrollmentService.findByStudent(studentId)));
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<ApiResponse<List<Enrollment>>> getByCourse(@PathVariable UUID courseId) {
        return ResponseEntity.ok(ApiResponse.ok(enrollmentService.findByCourse(courseId)));
    }
}
