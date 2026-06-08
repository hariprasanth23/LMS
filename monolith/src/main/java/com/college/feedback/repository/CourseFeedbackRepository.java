package com.college.feedback.repository;

import com.college.feedback.model.CourseFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CourseFeedbackRepository extends JpaRepository<CourseFeedback, UUID> {
    List<CourseFeedback> findByStudentIdAndSemester(UUID studentId, Integer semester);
    Optional<CourseFeedback> findByStudentIdAndCourseCodeAndSemester(UUID studentId, String courseCode, Integer semester);
    boolean existsByStudentIdAndCourseCodeAndSemester(UUID studentId, String courseCode, Integer semester);
}
