package com.lms.academics.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public class Entities {

    @Entity
    @Table(name = "course_wishlists",
           uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_code"}))
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CourseWishlist {
        @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
        @Column(name = "student_id", nullable = false) private UUID studentId;
        @Column(name = "course_code", nullable = false, length = 20) private String courseCode;
        @CreationTimestamp @Column(name = "added_at", updatable = false) private Instant addedAt;
    }

    @Entity @Table(name = "exc_registrations")
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ExcRegistration {
        @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
        @Column(name = "student_id", nullable = false) private UUID studentId;
        @Column(name = "activity_name", nullable = false) private String activityName;
        @Column(name = "activity_type", length = 50) private String activityType;
        @CreationTimestamp @Column(name = "registered_at", updatable = false) private Instant registeredAt;
        @Builder.Default @Column(nullable = false, length = 20) private String status = "REGISTERED";
    }

    @Entity @Table(name = "mooc_submissions")
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class MoocSubmission {
        @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
        @Column(name = "student_id", nullable = false) private UUID studentId;
        @Column(name = "course_name", nullable = false) private String courseName;
        @Column(length = 100) private String platform;
        @Column(length = 50)  private String duration;
        @Column(name = "certificate_url", columnDefinition = "TEXT") private String certificateUrl;
        @CreationTimestamp @Column(name = "submitted_at", updatable = false) private Instant submittedAt;
        @Builder.Default @Column(nullable = false, length = 20) private String status = "PENDING";
    }

    @Entity @Table(name = "internship_registrations")
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class InternshipRegistration {
        @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
        @Column(name = "student_id", nullable = false) private UUID studentId;
        @Column(name = "company_name", nullable = false) private String companyName;
        @Column(length = 100) private String role;
        @Column(name = "start_date") private LocalDate startDate;
        @Column(name = "end_date")   private LocalDate endDate;
        @Column(precision = 10, scale = 2) private BigDecimal stipend;
        @Builder.Default @Column(nullable = false, length = 20) private String status = "REGISTERED";
        @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
    }

    @Entity @Table(name = "conference_registrations")
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ConferenceRegistration {
        @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
        @Column(name = "student_id", nullable = false) private UUID studentId;
        @Column(name = "conference_name", nullable = false) private String conferenceName;
        private String organizer;
        @Column(name = "conference_date") private LocalDate conferenceDate;
        @Column(name = "paper_title") private String paperTitle;
        @Builder.Default @Column(nullable = false, length = 20) private String status = "REGISTERED";
        @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
    }

    @Entity @Table(name = "project_applications")
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ProjectApplication {
        @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
        @Column(name = "student_id", nullable = false) private UUID studentId;
        @Column(name = "project_title", nullable = false) private String projectTitle;
        @Column(name = "supervisor_id") private UUID supervisorId;
        @Column(columnDefinition = "TEXT") private String description;
        @Builder.Default @Column(nullable = false, length = 20) private String status = "PENDING";
        @CreationTimestamp @Column(name = "applied_at", updatable = false) private Instant appliedAt;
    }
}
