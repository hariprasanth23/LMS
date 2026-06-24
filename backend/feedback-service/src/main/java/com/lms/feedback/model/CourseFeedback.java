package com.lms.feedback.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "course_feedback",
       uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CourseFeedback {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "student_id", nullable = false) private UUID studentId;
    @Column(name = "course_id",  nullable = false) private UUID courseId;
    @Column(nullable = false)                       private Integer rating;
    @Column(columnDefinition = "TEXT")              private String comments;
    @CreationTimestamp @Column(name = "submitted_at", updatable = false) private Instant submittedAt;
}
