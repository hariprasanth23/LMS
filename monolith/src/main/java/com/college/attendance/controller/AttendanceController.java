package com.college.attendance.controller;

import com.college.attendance.dto.AttendanceSummary;
import com.college.attendance.dto.EmployeeAttendanceRequest;
import com.college.attendance.dto.MarkStudentAttendanceRequest;
import com.college.attendance.model.EmployeeAttendance;
import com.college.attendance.model.StudentAttendance;
import com.college.attendance.service.AttendanceService;
import com.college.auth.model.User;
import com.college.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/student")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<ApiResponse<List<StudentAttendance>>> markStudentAttendance(
            @Valid @RequestBody MarkStudentAttendanceRequest request,
            @AuthenticationPrincipal User currentUser) {
        List<StudentAttendance> records = attendanceService.markStudentAttendance(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Attendance marked", records));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<ApiResponse<List<StudentAttendance>>> getStudentAttendance(@PathVariable UUID studentId) {
        return ResponseEntity.ok(ApiResponse.ok(attendanceService.getStudentAttendance(studentId)));
    }

    @GetMapping("/course/{courseId}/date/{date}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<ApiResponse<List<StudentAttendance>>> getCourseAttendanceOnDate(
            @PathVariable UUID courseId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.ok(attendanceService.getCourseAttendanceOnDate(courseId, date)));
    }

    @GetMapping("/student/{studentId}/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<ApiResponse<List<AttendanceSummary>>> getStudentAttendanceSummary(
            @PathVariable UUID studentId) {
        return ResponseEntity.ok(ApiResponse.ok(attendanceService.getStudentAttendanceSummary(studentId)));
    }

    @PostMapping("/employee")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STAFF')")
    public ResponseEntity<ApiResponse<EmployeeAttendance>> markEmployeeAttendance(
            @Valid @RequestBody EmployeeAttendanceRequest request,
            @AuthenticationPrincipal User currentUser) {
        EmployeeAttendance record = attendanceService.markEmployeeAttendance(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Attendance recorded", record));
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STAFF')")
    public ResponseEntity<ApiResponse<List<EmployeeAttendance>>> getEmployeeAttendance(
            @PathVariable UUID employeeId) {
        return ResponseEntity.ok(ApiResponse.ok(attendanceService.getEmployeeAttendance(employeeId)));
    }
}
