package com.college.examination.repository;

import com.college.examination.model.SemesterGrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface SemesterGradeRepository extends JpaRepository<SemesterGrade, UUID> {
    List<SemesterGrade> findByStudentIdAndSemesterOrderByCourseCode(UUID studentId, Integer semester);
    List<SemesterGrade> findByStudentIdOrderBySemesterDescCourseCode(UUID studentId);

    @Query("SELECT g.semester, SUM(g.credits * g.gradePoints) / SUM(g.credits) " +
           "FROM SemesterGrade g WHERE g.studentId = :studentId " +
           "GROUP BY g.semester ORDER BY g.semester")
    List<Object[]> findSgpaByStudentId(@Param("studentId") UUID studentId);
}
