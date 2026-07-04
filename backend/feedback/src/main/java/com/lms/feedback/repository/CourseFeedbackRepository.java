package com.lms.feedback.repository;

import com.lms.feedback.model.CourseFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourseFeedbackRepository extends JpaRepository<CourseFeedback, UUID> {
    List<CourseFeedback> findByStudentId(UUID studentId);
    boolean existsByStudentIdAndCourseId(UUID studentId, UUID courseId);
}
