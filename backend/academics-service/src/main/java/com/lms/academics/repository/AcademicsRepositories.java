package com.lms.academics.repository;

import com.lms.academics.model.Entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public class AcademicsRepositories {

    @Repository
    public interface CourseWishlistRepository extends JpaRepository<CourseWishlist, UUID> {
        List<CourseWishlist> findByStudentId(UUID studentId);
        Optional<CourseWishlist> findByStudentIdAndCourseCode(UUID studentId, String courseCode);
    }

    @Repository
    public interface ExcRegistrationRepository extends JpaRepository<ExcRegistration, UUID> {
        List<ExcRegistration> findByStudentId(UUID studentId);
    }

    @Repository
    public interface MoocRepository extends JpaRepository<MoocSubmission, UUID> {
        List<MoocSubmission> findByStudentIdOrderBySubmittedAtDesc(UUID studentId);
    }

    @Repository
    public interface InternshipRepository extends JpaRepository<InternshipRegistration, UUID> {
        List<InternshipRegistration> findByStudentIdOrderByCreatedAtDesc(UUID studentId);
    }

    @Repository
    public interface ConferenceRepository extends JpaRepository<ConferenceRegistration, UUID> {
        List<ConferenceRegistration> findByStudentIdOrderByCreatedAtDesc(UUID studentId);
    }

    @Repository
    public interface ProjectApplicationRepository extends JpaRepository<ProjectApplication, UUID> {
        List<ProjectApplication> findByStudentIdOrderByAppliedAtDesc(UUID studentId);
    }
}
