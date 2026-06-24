package com.lms.studentservices.repository;

import com.lms.studentservices.model.Entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

public class Repositories {

    @Repository
    public interface BonafideRepository extends JpaRepository<BonafideApplication, UUID> {
        List<BonafideApplication> findByStudentIdOrderByCreatedAtDesc(UUID studentId);
    }

    @Repository
    public interface LibraryBookRepository extends JpaRepository<LibraryBook, UUID> {
        List<LibraryBook> findByIssuedToStudent(UUID studentId);
        long countByAvailabilityStatus(String status);
    }

    @Repository
    public interface BookRecommendationRepository extends JpaRepository<BookRecommendation, UUID> {
        List<BookRecommendation> findByStudentIdOrderByCreatedAtDesc(UUID studentId);
    }

    @Repository
    public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, UUID> {
        List<ServiceRequest> findByStudentIdOrderBySubmittedAtDesc(UUID studentId);
        List<ServiceRequest> findByStudentIdAndRequestTypeOrderBySubmittedAtDesc(UUID studentId, String requestType);
    }

    @Repository
    public interface HealthFeedbackRepository extends JpaRepository<HealthFeedback, UUID> {
        List<HealthFeedback> findByUserIdOrderBySubmittedAtDesc(UUID userId);
    }
}
