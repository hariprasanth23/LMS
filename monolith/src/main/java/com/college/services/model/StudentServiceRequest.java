package com.college.services.model;

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
@Table(schema = "services", name = "student_service_requests")
public class StudentServiceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid DEFAULT gen_random_uuid()")
    private UUID id;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "request_type", length = 50, nullable = false)
    private String requestType;

    @Column(name = "request_number", length = 30, unique = true)
    private String requestNumber;

    @Column(name = "details", columnDefinition = "TEXT")
    private String details;

    @Column(name = "status", length = 30)
    @Builder.Default
    private String status = "Pending";

    @CreationTimestamp
    @Column(name = "submitted_at", updatable = false)
    private LocalDateTime submittedAt;
}
