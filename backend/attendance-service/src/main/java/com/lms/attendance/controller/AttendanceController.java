package com.lms.attendance.controller;

import com.lms.attendance.common.ApiResponse;
import com.lms.attendance.model.EmployeeAttendance;
import com.lms.attendance.model.StudentAttendance;
import com.lms.attendance.repository.EmployeeAttendanceRepository;
import com.lms.attendance.repository.StudentAttendanceRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final StudentAttendanceRepository  studentRepo;
    private final EmployeeAttendanceRepository employeeRepo;

    // ── Students ────────────────────────────────────────────────────────────────

    @PostMapping("/student")
    public ResponseEntity<ApiResponse<StudentAttendance>> markStudent(
            @RequestHeader("X-User-Id") String markerId,
            @Valid @RequestBody StudentMarkReq req) {
        StudentAttendance saved = studentRepo.save(StudentAttendance.builder()
                .studentId(req.getStudentId()).courseId(req.getCourseId())
                .date(req.getDate()).status(req.getStatus())
                .markedBy(UUID.fromString(markerId))
                .build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Marked", saved));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<StudentAttendance>>> studentLog(@PathVariable UUID studentId) {
        return ResponseEntity.ok(ApiResponse.success("OK", studentRepo.findByStudentIdOrderByDateDesc(studentId)));
    }

    @GetMapping("/course/{courseId}/date/{date}")
    public ResponseEntity<ApiResponse<List<StudentAttendance>>> courseDate(
            @PathVariable UUID courseId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.success("OK", studentRepo.findByCourseIdAndDate(courseId, date)));
    }

    @GetMapping("/student/{studentId}/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> summary(@PathVariable UUID studentId) {
        long total = studentRepo.countByStudentId(studentId);
        long present = studentRepo.countByStudentIdAndStatus(studentId, "PRESENT");
        double pct = total == 0 ? 0.0 : Math.round((present * 1000.0 / total)) / 10.0;
        return ResponseEntity.ok(ApiResponse.success("OK", Map.of(
                "total", total, "present", present, "percentage", pct)));
    }

    // ── Employees ──────────────────────────────────────────────────────────────

    @PostMapping("/employee")
    public ResponseEntity<ApiResponse<EmployeeAttendance>> markEmployee(
            @RequestHeader("X-User-Id") String markerId,
            @Valid @RequestBody EmployeeMarkReq req) {
        EmployeeAttendance saved = employeeRepo.save(EmployeeAttendance.builder()
                .employeeId(req.getEmployeeId()).date(req.getDate()).status(req.getStatus())
                .checkIn(req.getCheckIn()).checkOut(req.getCheckOut())
                .markedBy(UUID.fromString(markerId))
                .build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Marked", saved));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<EmployeeAttendance>>> employeeLog(@PathVariable UUID employeeId) {
        return ResponseEntity.ok(ApiResponse.success("OK", employeeRepo.findByEmployeeIdOrderByDateDesc(employeeId)));
    }

    @Data
    public static class StudentMarkReq {
        @NotNull private UUID studentId;
        @NotNull private UUID courseId;
        @NotNull private LocalDate date;
        @NotNull private String status;
    }

    @Data
    public static class EmployeeMarkReq {
        @NotNull private UUID employeeId;
        @NotNull private LocalDate date;
        @NotNull private String status;
        private LocalTime checkIn;
        private LocalTime checkOut;
    }
}
