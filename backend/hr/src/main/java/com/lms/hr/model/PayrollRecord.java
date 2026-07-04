package com.lms.hr.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "payroll_records",
       uniqueConstraints = @UniqueConstraint(columnNames = {"employee_id", "month", "year"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PayrollRecord {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "employee_id", nullable = false) private UUID employeeId;
    @Column(nullable = false) private Integer month;
    @Column(nullable = false) private Integer year;
    @Column(name = "base_salary", nullable = false, precision = 12, scale = 2) private BigDecimal baseSalary;
    @Builder.Default
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal allowance = BigDecimal.ZERO;
    @Builder.Default
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal deduction = BigDecimal.ZERO;
    @Builder.Default
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal bonus     = BigDecimal.ZERO;

    /** PG-side {@code GENERATED ALWAYS AS (base + allowance + bonus - deduction) STORED}. */
    @Column(name = "net_salary", insertable = false, updatable = false, precision = 12, scale = 2)
    private BigDecimal netSalary;

    @Builder.Default
    @Column(nullable = false, length = 20) private String status = "DRAFT";

    @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
}
