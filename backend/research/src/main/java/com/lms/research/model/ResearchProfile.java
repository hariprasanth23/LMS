package com.lms.research.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "research_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ResearchProfile {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;

    /** Student-side primary identity is its own UUID; for this service that's
     *  the auth-service user id (caller's X-User-Id). */
    @Column(name = "student_id", nullable = false, unique = true) private UUID studentId;

    @Column(name = "research_topic", nullable = false) private String researchTopic;
    @Column(name = "advisor_id")                       private UUID advisorId;
    @Column(name = "start_date")                       private LocalDate startDate;

    @Builder.Default
    @Column(nullable = false, length = 20)
    private String status = "ONGOING";

    @CreationTimestamp @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}
