package com.lms.finance.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "refund_requests")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RefundRequest {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "student_id", nullable = false) private UUID studentId;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal amount;
    @Column(columnDefinition = "TEXT") private String reason;
    @Builder.Default
    @Column(nullable = false, length = 20) private String status = "PENDING";
    @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
    @UpdateTimestamp   @Column(name = "updated_at") private Instant updatedAt;
}
