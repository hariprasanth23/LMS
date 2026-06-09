package com.college.student.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(schema = "student", name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid DEFAULT gen_random_uuid()")
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "roll_number", length = 20, unique = true, nullable = false)
    private String rollNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    // ── Academic ──────────────────────────────────────────────────────────────

    @Column(name = "program", length = 50)
    private String program;              // B.Tech, M.Tech, M.E., Ph.D, B.E., MCA, MBA

    @Column(name = "semester")
    private Integer semester;

    @Column(name = "section", length = 10)
    private String section;             // A, B, C, D

    @Column(name = "batch", length = 20)
    private String batch;               // e.g. 2023-27

    @Column(name = "admission_year")
    private Integer admissionYear;

    @Column(name = "join_date")
    private LocalDate joinDate;

    @Builder.Default
    @Column(name = "status", length = 20)
    private String status = "ACTIVE";

    // ── Personal ──────────────────────────────────────────────────────────────

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "gender", length = 10)
    private String gender;              // MALE, FEMALE, OTHER

    @Column(name = "blood_group", length = 5)
    private String bloodGroup;          // A+, A-, B+, B-, O+, O-, AB+, AB-

    @Column(name = "category", length = 20)
    private String category;            // GENERAL, OBC, SC, ST, NT, EWS

    @Column(name = "aadhaar_number", length = 12)
    private String aadhaarNumber;

    // ── Contact ───────────────────────────────────────────────────────────────

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    // ── Family ───────────────────────────────────────────────────────────────

    @Column(name = "father_name", length = 100)
    private String fatherName;

    @Column(name = "mother_name", length = 100)
    private String motherName;

    @Column(name = "parent_phone", length = 20)
    private String parentPhone;

    @Column(name = "guardian_name", length = 100)
    private String guardianName;

    @Column(name = "guardian_phone", length = 20)
    private String guardianPhone;

    // ── Emergency ─────────────────────────────────────────────────────────────

    @Column(name = "emergency_contact_name", length = 100)
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone", length = 20)
    private String emergencyContactPhone;

    // ── Audit ─────────────────────────────────────────────────────────────────

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
