package com.college.attendance.repository;

import com.college.attendance.model.StudentAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentAttendanceRepository extends JpaRepository<StudentAttendance, UUID> {

    List<StudentAttendance> findByStudentId(UUID studentId);

    List<StudentAttendance> findByStudentIdOrderByDateDesc(UUID studentId);

    List<StudentAttendance> findByCourseIdAndDate(UUID courseId, LocalDate date);

    List<StudentAttendance> findByStudentIdAndCourseId(UUID studentId, UUID courseId);

    Optional<StudentAttendance> findByStudentIdAndCourseIdAndDate(UUID studentId, UUID courseId, LocalDate date);

    boolean existsByStudentIdAndCourseIdAndDate(UUID studentId, UUID courseId, LocalDate date);

    @Query("SELECT DISTINCT sa.courseId FROM StudentAttendance sa WHERE sa.studentId = :studentId")
    List<UUID> findDistinctCourseIdsByStudentId(@Param("studentId") UUID studentId);

    @Query("SELECT COUNT(sa) FROM StudentAttendance sa WHERE sa.studentId = :studentId AND sa.courseId = :courseId")
    long countByStudentIdAndCourseId(@Param("studentId") UUID studentId, @Param("courseId") UUID courseId);

    @Query("SELECT COUNT(sa) FROM StudentAttendance sa WHERE sa.studentId = :studentId AND sa.courseId = :courseId AND sa.status = :status")
    long countByStudentIdAndCourseIdAndStatus(@Param("studentId") UUID studentId,
                                              @Param("courseId") UUID courseId,
                                              @Param("status") String status);
}
