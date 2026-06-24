package com.lms.notification.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "notifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false) private UUID userId;
    @Column(nullable = false)                    private String title;
    @Column(nullable = false, columnDefinition = "TEXT") private String message;

    @Builder.Default
    @Column(nullable = false, length = 20)
    private String type = "INFO";

    @Builder.Default
    @Column(name = "is_read", nullable = false)
    private boolean read = false;

    @CreationTimestamp @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}
