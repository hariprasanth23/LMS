package com.lms.course.repository;

import com.lms.course.model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public class CourseRepositories {

    @Repository
    public interface CourseRepository extends JpaRepository<Course, UUID> {
        Optional<Course> findByCode(String code);
        boolean existsByCode(String code);
        Page<Course> findByDepartmentId(Long departmentId, Pageable pageable);
        Page<Course> findByFacultyId(UUID facultyId, Pageable pageable);
    }

    @Repository
    public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {
        List<Enrollment> findByStudentId(UUID studentId);
        List<Enrollment> findByCourseId(UUID courseId);
        boolean existsByStudentIdAndCourseId(UUID studentId, UUID courseId);
    }

    @Repository
    public interface CourseMaterialRepository extends JpaRepository<CourseMaterial, UUID> {
        List<CourseMaterial> findByCourseIdOrderByCreatedAtDesc(UUID courseId);
    }

    @Repository
    public interface AssignmentRepository extends JpaRepository<Assignment, UUID> {
        List<Assignment> findByCourseIdOrderByDueDateAsc(UUID courseId);
    }

    @Repository
    public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, UUID> {
        List<AssignmentSubmission> findByAssignmentId(UUID assignmentId);
        Optional<AssignmentSubmission> findByAssignmentIdAndStudentId(UUID assignmentId, UUID studentId);
    }

    @Repository
    public interface QuizRepository extends JpaRepository<Quiz, UUID> {
        List<Quiz> findByCourseId(UUID courseId);
    }

    @Repository
    public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, UUID> {
        List<QuizQuestion> findByQuizId(UUID quizId);
    }

    @Repository
    public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, UUID> {
        boolean existsByQuizIdAndStudentId(UUID quizId, UUID studentId);
    }

    @Repository
    public interface AnnouncementRepository extends JpaRepository<Announcement, UUID> {
        List<Announcement> findAllByOrderByCreatedAtDesc();
        List<Announcement> findByCourseIdOrderByCreatedAtDesc(UUID courseId);
    }
}
