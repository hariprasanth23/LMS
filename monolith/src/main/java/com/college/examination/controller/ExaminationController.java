package com.college.examination.controller;

import com.college.auth.model.User;
import com.college.common.dto.ApiResponse;
import com.college.examination.repository.ScheduledOnlineExamRepository;
import com.college.examination.service.ExaminationService;
import com.college.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/examination")
@RequiredArgsConstructor
public class ExaminationController {

    private final ExaminationService service;
    private final ScheduledOnlineExamRepository onlineExamRepository;
    private final StudentRepository studentRepository;

    @GetMapping("/schedule")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getSchedule(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getExamSchedule(user)));
    }

    @GetMapping("/marks")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getMarks(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getMarks(user)));
    }

    @GetMapping("/grades")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getGrades(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getGrades(user)));
    }

    @GetMapping("/grade-history")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getGradeHistory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getGradeHistory(user)));
    }

    @GetMapping("/online-exam/scheduled")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<?>> getScheduledOnlineExams(@AuthenticationPrincipal User user) {
        var student = studentRepository.findByUserId(user.getId()).orElse(null);
        if (student == null) return ResponseEntity.ok(ApiResponse.ok(java.util.List.of()));
        return ResponseEntity.ok(ApiResponse.ok(
                onlineExamRepository.findByStudentIdOrderByExamDate(student.getId())));
    }
}
