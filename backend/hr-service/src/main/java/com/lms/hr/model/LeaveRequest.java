package com.lms.hr.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "leave_requests")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LeaveRequest {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "employee_id", nullable = false) private UUID employeeId;
    @Column(name = "leave_type",  nullable = false, length = 10) private String leaveType;
    @Column(name = "from_date",   nullable = false) private LocalDate fromDate;
    @Column(name = "to_date",     nullable = false) private LocalDate toDate;
    @Column(columnDefinition = "TEXT") private String reason;
    @Builder.Default
    @Column(nullable = false, length = 20) private String status = "PENDING";
    @Column(name = "reviewed_by") private UUID reviewedBy;
    @Column(name = "review_note", columnDefinition = "TEXT") private String reviewNote;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
    @UpdateTimestamp   @Column(name = "updated_at") private Instant updatedAt;
}
