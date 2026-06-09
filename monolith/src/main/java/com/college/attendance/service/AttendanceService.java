package com.college.attendance.service;

import com.college.attendance.dto.AttendanceSummary;
import com.college.attendance.dto.EmployeeAttendanceRequest;
import com.college.attendance.dto.MarkStudentAttendanceRequest;
import com.college.attendance.dto.StudentAttendanceEntry;
import com.college.attendance.model.EmployeeAttendance;
import com.college.attendance.model.StudentAttendance;
import com.college.attendance.repository.EmployeeAttendanceRepository;
import com.college.attendance.repository.StudentAttendanceRepository;
import com.college.auth.model.User;
import com.college.lms.model.Course;
import com.college.lms.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final StudentAttendanceRepository studentAttendanceRepository;
    private final EmployeeAttendanceRepository employeeAttendanceRepository;
    private final CourseRepository courseRepository;

    @Transactional
    public List<StudentAttendance> markStudentAttendance(MarkStudentAttendanceRequest request, User faculty) {
        List<StudentAttendance> saved = new ArrayList<>();
        for (StudentAttendanceEntry entry : request.getEntries()) {
            // Single query eliminates the exists-then-find race window
            StudentAttendance record = studentAttendanceRepository
                    .findByStudentIdAndCourseIdAndDate(
                            entry.getStudentId(), request.getCourseId(), request.getDate())
                    .map(existing -> {
                        existing.setStatus(entry.getStatus());
                        existing.setMarkedBy(faculty.getId());
                        return existing;
                    })
                    .orElseGet(() -> StudentAttendance.builder()
                            .studentId(entry.getStudentId())
                            .courseId(request.getCourseId())
                            .date(request.getDate())
                            .status(entry.getStatus())
                            .markedBy(faculty.getId())
                            .build());
            saved.add(studentAttendanceRepository.save(record));
        }
        return saved;
    }

    public List<StudentAttendance> getStudentAttendance(UUID studentId) {
        return studentAttendanceRepository.findByStudentIdOrderByDateDesc(studentId);
    }

    public List<StudentAttendance> getCourseAttendanceOnDate(UUID courseId, LocalDate date) {
        return studentAttendanceRepository.findByCourseIdAndDate(courseId, date);
    }

    public List<AttendanceSummary> getStudentAttendanceSummary(UUID studentId) {
        List<UUID> courseIds = studentAttendanceRepository.findDistinctCourseIdsByStudentId(studentId);

        // Fetch course names in one query
        Map<UUID, Course> courseMap = courseRepository.findAllById(courseIds)
                .stream().collect(Collectors.toMap(Course::getId, c -> c));

        List<AttendanceSummary> summaries = new ArrayList<>();
        for (UUID courseId : courseIds) {
            long total   = studentAttendanceRepository.countByStudentIdAndCourseId(studentId, courseId);
            long present = studentAttendanceRepository.countByStudentIdAndCourseIdAndStatus(studentId, courseId, "PRESENT");
            long absent  = studentAttendanceRepository.countByStudentIdAndCourseIdAndStatus(studentId, courseId, "ABSENT");
            long late    = studentAttendanceRepository.countByStudentIdAndCourseIdAndStatus(studentId, courseId, "LATE");
            long excused = studentAttendanceRepository.countByStudentIdAndCourseIdAndStatus(studentId, courseId, "EXCUSED");
            double percentage = total > 0 ? Math.round(((present + late) * 100.0 / total) * 100.0) / 100.0 : 0.0;

            Course course = courseMap.get(courseId);
            summaries.add(AttendanceSummary.builder()
                    .courseId(courseId)
                    .courseCode(course != null ? course.getCode() : null)
                    .courseName(course != null ? course.getName() : null)
                    .totalClasses(total)
                    .presentCount(present)
                    .absentCount(absent)
                    .lateCount(late)
                    .excusedCount(excused)
                    .attendancePercentage(percentage)
                    .build());
        }
        return summaries;
    }

    @Transactional
    public EmployeeAttendance markEmployeeAttendance(EmployeeAttendanceRequest request, User currentUser) {
        LocalDate date = request.getDate() != null ? request.getDate() : LocalDate.now();

        // Single query eliminates the exists-then-find race window
        EmployeeAttendance record = employeeAttendanceRepository
                .findByEmployeeIdAndDate(currentUser.getId(), date)
                .map(existing -> {
                    if (request.getCheckOut() != null) existing.setCheckOut(request.getCheckOut());
                    if (request.getStatus()   != null) existing.setStatus(request.getStatus());
                    if (request.getRemarks()  != null) existing.setRemarks(request.getRemarks());
                    return existing;
                })
                .orElseGet(() -> EmployeeAttendance.builder()
                        .employeeId(currentUser.getId())
                        .date(date)
                        .checkIn(request.getCheckIn())
                        .checkOut(request.getCheckOut())
                        .status(request.getStatus() != null ? request.getStatus() : "PRESENT")
                        .remarks(request.getRemarks())
                        .build());
        return employeeAttendanceRepository.save(record);
    }

    public List<EmployeeAttendance> getEmployeeAttendance(UUID employeeId) {
        return employeeAttendanceRepository.findByEmployeeIdOrderByDateDesc(employeeId);
    }
}
