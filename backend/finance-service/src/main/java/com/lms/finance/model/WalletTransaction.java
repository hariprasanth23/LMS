package com.lms.finance.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "wallet_transactions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WalletTransaction {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "student_id", nullable = false) private UUID studentId;
    @Column(nullable = false, length = 10) private String type;            // CREDIT or DEBIT
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal amount;
    private String description;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
}
