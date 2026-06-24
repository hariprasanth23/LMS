package com.lms.feedback.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "feedback_247")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Feedback247 {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "student_id") private UUID studentId;   // null if anonymous
    @Column(length = 50)         private String category;
    private Integer rating;
    @Column(columnDefinition = "TEXT") private String comments;
    @Builder.Default
    @Column(name = "is_anonymous", nullable = false) private boolean anonymous = false;
    @CreationTimestamp @Column(name = "submitted_at", updatable = false) private Instant submittedAt;
}
