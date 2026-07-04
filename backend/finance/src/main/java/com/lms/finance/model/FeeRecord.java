package com.lms.finance.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "fee_records")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FeeRecord {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "student_id", nullable = false) private UUID studentId;
    @Column(name = "fee_type", nullable = false, length = 50) private String feeType;
    @Column(nullable = false, precision = 12, scale = 2)      private BigDecimal amount;
    @Column(name = "due_date")    private LocalDate dueDate;
    @Builder.Default
    @Column(nullable = false, length = 20)
    private String status = "PENDING";
    @Column(name = "academic_year", length = 10) private String academicYear;
    private Integer semester;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
}
