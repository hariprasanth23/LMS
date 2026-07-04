package com.lms.exam.model;

// One file holding all entities for the exam domain. Each is its own @Entity
// class so JPA discovers them, but they share this file for brevity.

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public class Entities {

    @Entity @Table(name = "exam_schedule")
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ExamSchedule {
        @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
        @Column(name = "course_code", nullable = false, length = 20) private String courseCode;
        @Column(name = "course_name", nullable = false) private String courseName;
        @Column(name = "exam_date",   nullable = false) private LocalDate examDate;
        @Column(name = "time_slot",  length = 50) private String timeSlot;
        @Column(length = 100) private String venue;
        @Column(name = "exam_type", length = 30) private String examType;
        private Integer semester;
        @Column(length = 20) private String batch;
        @Column(name = "department_code", length = 20) private String departmentCode;
        @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
    }

    @Entity @Table(name = "internal_marks",
                   uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_id", "exam_type"}))
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class InternalMark {
        @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
        @Column(name = "student_id", nullable = false) private UUID studentId;
        @Column(name = "course_id",  nullable = false) private UUID courseId;
        @Column(precision = 5, scale = 2) private BigDecimal marks;
        @Builder.Default
        @Column(name = "max_marks", nullable = false, precision = 5, scale = 2) private BigDecimal maxMarks = BigDecimal.valueOf(100);
        @Column(name = "exam_type", length = 30) private String examType;
        @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
    }

    @Entity @Table(name = "semester_grades",
                   uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "semester", "academic_year"}))
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class SemesterGrade {
        @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
        @Column(name = "student_id", nullable = false) private UUID studentId;
        @Column(nullable = false) private Integer semester;
        @Column(precision = 4, scale = 2) private BigDecimal gpa;
        @Column(name = "grade_points", precision = 5, scale = 2) private BigDecimal gradePoints;
        private Integer credits;
        @Column(length = 20) private String status;
        @Column(name = "academic_year", length = 10) private String academicYear;
        @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
    }

    @Entity @Table(name = "arrear_registrations")
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ArrearRegistration {
        @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
        @Column(name = "student_id", nullable = false) private UUID studentId;
        @Column(name = "course_code", nullable = false, length = 20) private String courseCode;
        @Column(name = "registration_date", nullable = false) private LocalDate registrationDate;
        @Builder.Default
        @Column(nullable = false, length = 20) private String status = "REGISTERED";
        @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
    }

    @Entity @Table(name = "makeup_exam_applications")
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class MakeupApplication {
        @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
        @Column(name = "student_id", nullable = false) private UUID studentId;
        @Column(name = "course_id",  nullable = false) private UUID courseId;
        @Column(columnDefinition = "TEXT") private String reason;
        @Builder.Default
        @Column(nullable = false, length = 20) private String status = "PENDING";
        @CreationTimestamp @Column(name = "applied_at", updatable = false) private Instant appliedAt;
    }

    @Entity @Table(name = "scheduled_online_exams")
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ScheduledOnlineExam {
        @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
        @Column(name = "student_id", nullable = false) private UUID studentId;
        @Column(name = "exam_date",  nullable = false) private Instant examDate;
        @Column(name = "course_id")  private UUID courseId;
        @Column(name = "duration_minutes") private Integer durationMinutes;
        @Builder.Default
        @Column(nullable = false, length = 20) private String status = "SCHEDULED";
        @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
    }
}
