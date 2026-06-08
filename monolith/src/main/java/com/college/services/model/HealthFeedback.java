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
@Table(schema = "services", name = "health_feedback")
public class HealthFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid DEFAULT gen_random_uuid()")
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "visit_reason", length = 200)
    private String visitReason;

    @Column(name = "doctor_rating")
    private Integer doctorRating;

    @Column(name = "facility_rating")
    private Integer facilityRating;

    @Column(name = "wait_time_rating")
    private Integer waitTimeRating;

    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;

    @Column(name = "anonymous")
    @Builder.Default
    private Boolean anonymous = true;

    @CreationTimestamp
    @Column(name = "submitted_at", updatable = false)
    private LocalDateTime submittedAt;
}
