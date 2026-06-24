package com.lms.course.controller;

import com.lms.course.common.ApiResponse;
import com.lms.course.model.Enrollment;
import com.lms.course.repository.CourseRepositories.EnrollmentRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentRepository repo;

    @PostMapping
    public ResponseEntity<ApiResponse<Enrollment>> enroll(@Valid @RequestBody Req req) {
        if (repo.existsByStudentIdAndCourseId(req.getStudentId(), req.getCourseId()))
            throw new IllegalStateException("Already enrolled");
        Enrollment saved = repo.save(Enrollment.builder()
                .studentId(req.getStudentId()).courseId(req.getCourseId())
                .enrollmentDate(LocalDate.now()).status("ACTIVE").build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Enrolled", saved));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<Enrollment>>> byStudent(@PathVariable UUID studentId) {
        return ResponseEntity.ok(ApiResponse.success("OK", repo.findByStudentId(studentId)));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<List<Enrollment>>> byCourse(@PathVariable UUID courseId) {
        return ResponseEntity.ok(ApiResponse.success("OK", repo.findByCourseId(courseId)));
    }

    @Data public static class Req {
        @NotNull private UUID studentId;
        @NotNull private UUID courseId;
    }
}
