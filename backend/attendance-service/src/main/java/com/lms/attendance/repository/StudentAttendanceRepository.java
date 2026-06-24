package com.lms.attendance.repository;

import com.lms.attendance.model.StudentAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface StudentAttendanceRepository extends JpaRepository<StudentAttendance, UUID> {
    List<StudentAttendance> findByStudentIdOrderByDateDesc(UUID studentId);
    List<StudentAttendance> findByCourseIdAndDate(UUID courseId, LocalDate date);
    long countByStudentId(UUID studentId);
    long countByStudentIdAndStatus(UUID studentId, String status);
}
