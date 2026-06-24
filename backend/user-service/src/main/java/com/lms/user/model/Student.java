package com.lms.user.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "students")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Student {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /** auth-service user id — populated from X-User-Id on first login/import. */
    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(name = "roll_number", nullable = false, unique = true, length = 50)
    private String rollNumber;

    @Column(name = "department_id", nullable = false)
    private Long departmentId;

    @Column(nullable = false, length = 50) private String program;
    @Column(nullable = false)                private Integer semester;
    @Column(length = 10)                     private String section;
    @Column(nullable = false, length = 20)   private String batch;
    @Column(name = "admission_year", nullable = false) private Integer admissionYear;
    @Column(name = "join_date")              private LocalDate joinDate;

    @Builder.Default
    @Column(nullable = false, length = 20)
    private String status = "ACTIVE";

    @Column(name = "date_of_birth") private LocalDate dateOfBirth;
    @Column(length = 10)            private String gender;
    @Column(name = "blood_group", length = 5) private String bloodGroup;
    @Column(length = 20)            private String category;
    @Column(name = "aadhaar_number", length = 20) private String aadhaarNumber;
    @Column(columnDefinition = "TEXT") private String address;
    @Column(name = "father_name")   private String fatherName;
    @Column(name = "mother_name")   private String motherName;
    @Column(name = "parent_phone", length = 20) private String parentPhone;
    @Column(name = "guardian_name") private String guardianName;
    @Column(name = "guardian_phone", length = 20) private String guardianPhone;
    @Column(name = "emergency_contact_name")  private String emergencyContactName;
    @Column(name = "emergency_contact_phone", length = 20) private String emergencyContactPhone;

    @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
    @UpdateTimestamp   @Column(name = "updated_at")                    private Instant updatedAt;
}
