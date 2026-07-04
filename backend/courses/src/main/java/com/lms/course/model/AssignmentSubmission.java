package com.lms.course.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "assignment_submissions",
       uniqueConstraints = @UniqueConstraint(columnNames = {"assignment_id", "student_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AssignmentSubmission {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "assignment_id", nullable = false) private UUID assignmentId;
    @Column(name = "student_id",    nullable = false) private UUID studentId;
    @CreationTimestamp @Column(name = "submitted_at", updatable = false) private Instant submittedAt;
    @Column(name = "file_url", columnDefinition = "TEXT") private String fileUrl;
    @Column(name = "graded_marks") private Integer gradedMarks;
    @Column(columnDefinition = "TEXT") private String feedback;
}
