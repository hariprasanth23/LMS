package com.lms.finance.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "payment_receipts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PaymentReceipt {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "student_id", nullable = false) private UUID studentId;
    @Column(name = "fee_record_id") private UUID feeRecordId;
    @Column(name = "amount_paid", nullable = false, precision = 12, scale = 2) private BigDecimal amountPaid;
    @Column(name = "payment_method", length = 30) private String paymentMethod;
    @Column(name = "transaction_id", length = 100) private String transactionId;
    @CreationTimestamp @Column(name = "paid_at", updatable = false) private Instant paidAt;
}
