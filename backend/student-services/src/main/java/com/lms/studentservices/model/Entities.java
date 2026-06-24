package com.lms.studentservices.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public class Entities {

    @Entity @Table(name = "bonafide_applications")
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class BonafideApplication {
        @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
        @Column(name = "student_id", nullable = false) private UUID studentId;
        @Column(nullable = false) private String purpose;
        @Column(name = "addressed_to") private String addressedTo;
        @Builder.Default @Column(nullable = false, length = 30) private String language = "ENGLISH";
        @Builder.Default @Column(nullable = false) private Integer copies = 1;
        @Builder.Default @Column(nullable = false, length = 20) private String urgency = "NORMAL";
        @Builder.Default @Column(nullable = false, length = 20) private String status = "PENDING";
        @Column(name = "issued_date") private LocalDate issuedDate;
        @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
    }

    @Entity @Table(name = "library_books")
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class LibraryBook {
        @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
        @Column(nullable = false) private String title;
        private String author;
        @Column(length = 20) private String isbn;
        @Column(name = "call_number", length = 50) private String callNumber;
        @Builder.Default
        @Column(name = "availability_status", nullable = false, length = 20)
        private String availabilityStatus = "AVAILABLE";
        @Column(name = "issued_to_student") private UUID issuedToStudent;
        @Column(name = "due_date") private LocalDate dueDate;
        @CreationTimestamp @Column(name = "added_at", updatable = false) private Instant addedAt;
    }

    @Entity @Table(name = "book_recommendations")
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class BookRecommendation {
        @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
        @Column(name = "student_id", nullable = false) private UUID studentId;
        @Column(name = "book_title", nullable = false) private String bookTitle;
        private String author;
        private String publisher;
        @Column(length = 20) private String isbn;
        @Column(length = 50) private String category;
        @Column(columnDefinition = "TEXT") private String reason;
        @Builder.Default @Column(nullable = false, length = 20) private String status = "PENDING";
        @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
    }

    @Entity @Table(name = "student_service_requests")
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ServiceRequest {
        @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
        @Column(name = "student_id", nullable = false) private UUID studentId;
        @Column(name = "request_type", nullable = false, length = 50) private String requestType;
        @Column(name = "request_number", unique = true, length = 30) private String requestNumber;
        @Column(columnDefinition = "TEXT") private String details;
        @Builder.Default @Column(nullable = false, length = 20) private String status = "OPEN";
        @CreationTimestamp @Column(name = "submitted_at", updatable = false) private Instant submittedAt;
    }

    @Entity @Table(name = "health_feedback")
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class HealthFeedback {
        @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
        @Column(name = "user_id") private UUID userId;
        @Column(name = "visit_reason") private String visitReason;
        @Column(name = "doctor_rating")    private Integer doctorRating;
        @Column(name = "facility_rating")  private Integer facilityRating;
        @Column(name = "wait_time_rating") private Integer waitTimeRating;
        @Column(columnDefinition = "TEXT") private String comments;
        @Builder.Default @Column(name = "is_anonymous", nullable = false) private boolean anonymous = false;
        @CreationTimestamp @Column(name = "submitted_at", updatable = false) private Instant submittedAt;
    }
}
