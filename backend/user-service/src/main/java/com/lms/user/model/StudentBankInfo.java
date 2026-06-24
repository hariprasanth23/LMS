package com.lms.user.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "student_bank_info")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StudentBankInfo {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "student_id", nullable = false, unique = true)
    private UUID studentId;

    @Column(name = "account_holder_name") private String accountHolderName;
    @Column(name = "bank_name")            private String bankName;
    @Column(name = "account_number", length = 30) private String accountNumber;
    @Column(name = "ifsc_code", length = 15)      private String ifscCode;
    private String branch;

    @CreationTimestamp @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}
