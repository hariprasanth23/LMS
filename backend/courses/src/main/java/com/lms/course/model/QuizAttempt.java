package com.lms.course.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "quiz_attempts",
       uniqueConstraints = @UniqueConstraint(columnNames = {"quiz_id", "student_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class QuizAttempt {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "quiz_id",    nullable = false) private UUID quizId;
    @Column(name = "student_id", nullable = false) private UUID studentId;
    private Integer score;
    @CreationTimestamp @Column(name = "submitted_at", updatable = false) private Instant submittedAt;
    @JdbcTypeCode(SqlTypes.JSON) @Column(columnDefinition = "jsonb") private String answers;
}
