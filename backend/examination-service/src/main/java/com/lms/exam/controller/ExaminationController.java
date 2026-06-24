package com.lms.exam.controller;

import com.lms.exam.common.ApiResponse;
import com.lms.exam.model.Entities.*;
import com.lms.exam.repository.ExamRepositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/examination")
@RequiredArgsConstructor
public class ExaminationController {

    private final ExamScheduleRepository scheduleRepo;
    private final InternalMarkRepository markRepo;
    private final SemesterGradeRepository gradeRepo;
    private final ScheduledOnlineExamRepository onlineRepo;

    @GetMapping("/schedule")
    public ResponseEntity<ApiResponse<List<ExamSchedule>>> schedule() {
        return ResponseEntity.ok(ApiResponse.success("OK", scheduleRepo.findAllByOrderByExamDateAsc()));
    }

    @GetMapping("/marks")
    public ResponseEntity<ApiResponse<List<InternalMark>>> marks(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK", markRepo.findByStudentId(UUID.fromString(userId))));
    }

    @GetMapping("/grades")
    public ResponseEntity<ApiResponse<List<SemesterGrade>>> grades(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                gradeRepo.findByStudentIdOrderBySemesterDesc(UUID.fromString(userId))));
    }

    @GetMapping("/grade-history")
    public ResponseEntity<ApiResponse<List<SemesterGrade>>> gradeHistory(@RequestHeader("X-User-Id") String userId) {
        // Same data, frontend uses a different presentation.
        return grades(userId);
    }

    @GetMapping("/online-exam/scheduled")
    public ResponseEntity<ApiResponse<List<ScheduledOnlineExam>>> scheduledOnline(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                onlineRepo.findByStudentIdAndStatus(UUID.fromString(userId), "SCHEDULED")));
    }
}
