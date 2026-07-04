package com.lms.course.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity @Table(name = "announcements")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Announcement {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "course_id") private UUID courseId;  // null = institution-wide
    @Column(nullable = false)   private String title;
    @Column(nullable = false, columnDefinition = "TEXT") private String content;
    @Column(name = "created_by", nullable = false) private UUID createdBy;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
}
