package com.lms.user.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "employees")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Employee {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;

    @Column(name = "user_id", nullable = false, unique = true) private UUID userId;
    @Column(name = "emp_code", nullable = false, unique = true, length = 30) private String empCode;
    @Column(nullable = false) private String name;
    @Column(nullable = false, unique = true) private String email;
    @Column(length = 20)      private String phone;

    @Column(name = "department_id", nullable = false) private Long departmentId;
    @Column(length = 100)     private String designation;

    @Column(name = "employee_type", nullable = false, length = 20)
    private String employeeType;  // FACULTY or STAFF

    @Column(name = "join_date") private LocalDate joinDate;
    @Column(name = "base_salary", precision = 12, scale = 2) private BigDecimal baseSalary;

    @Builder.Default
    @Column(nullable = false, length = 20)
    private String status = "ACTIVE";

    @Column(columnDefinition = "TEXT") private String qualifications;

    @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
    @UpdateTimestamp   @Column(name = "updated_at")                   private Instant updatedAt;
}
