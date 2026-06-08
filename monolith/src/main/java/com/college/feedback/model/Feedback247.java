package com.college.feedback.model;

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
@Table(schema = "feedback", name = "feedback_247")
public class Feedback247 {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid DEFAULT gen_random_uuid()")
    private UUID id;

    @Column(name = "student_id")
    private UUID studentId;

    @Column(name = "course_code", length = 20)
    private String courseCode;

    @Column(name = "course_name", length = 200)
    private String courseName;

    @Column(name = "feedback_type", length = 50)
    private String feedbackType;

    @Column(name = "topic", length = 100)
    private String topic;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "feedback_text", columnDefinition = "TEXT")
    private String feedbackText;

    @Column(name = "anonymous")
    @Builder.Default
    private Boolean anonymous = true;

    @Column(name = "status", length = 50)
    @Builder.Default
    private String status = "Received";

    @CreationTimestamp
    @Column(name = "submitted_at", updatable = false)
    private LocalDateTime submittedAt;
}
