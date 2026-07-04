package com.lms.course.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity @Table(name = "assignments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Assignment {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "course_id", nullable = false) private UUID courseId;
    @Column(nullable = false) private String title;
    @Column(columnDefinition = "TEXT") private String description;
    @Column(name = "due_date") private Instant dueDate;
    @Builder.Default @Column(name = "max_marks", nullable = false) private Integer maxMarks = 100;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
}
