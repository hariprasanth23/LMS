package com.college.examination.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(schema = "examination", name = "arrear_registrations")
public class ArrearRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid DEFAULT gen_random_uuid()")
    private UUID id;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "course_code", length = 20, nullable = false)
    private String courseCode;

    @Column(name = "course_name", length = 200, nullable = false)
    private String courseName;

    @Column(name = "regulation", length = 20)
    private String regulation;

    @Column(name = "fee_amount", nullable = false)
    private Integer feeAmount;

    @Column(name = "receipt_number", length = 50)
    private String receiptNumber;

    @Column(name = "status", length = 20)
    @Builder.Default
    private String status = "Paid";

    @CreationTimestamp
    @Column(name = "registered_at", updatable = false)
    private LocalDateTime registeredAt;
}
