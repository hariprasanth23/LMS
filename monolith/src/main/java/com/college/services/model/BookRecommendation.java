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
@Table(schema = "services", name = "book_recommendations")
public class BookRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid DEFAULT gen_random_uuid()")
    private UUID id;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "title", length = 255, nullable = false)
    private String title;

    @Column(name = "author", length = 200)
    private String author;

    @Column(name = "publisher", length = 200)
    private String publisher;

    @Column(name = "isbn", length = 30)
    private String isbn;

    @Column(name = "category", length = 50)
    private String category;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Column(name = "status", length = 30)
    @Builder.Default
    private String status = "Pending";

    @CreationTimestamp
    @Column(name = "submitted_at", updatable = false)
    private LocalDateTime submittedAt;
}
