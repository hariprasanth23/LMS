package com.lms.course.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity @Table(name = "course_materials")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CourseMaterial {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "course_id", nullable = false) private UUID courseId;
    @Column(nullable = false) private String title;
    @Column(columnDefinition = "TEXT") private String description;
    @Column(columnDefinition = "TEXT") private String url;
    @Column(length = 30) private String type;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
}
