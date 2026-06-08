package com.college.academics.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(schema = "student", name = "mooc_submissions")
public class MOOCSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid DEFAULT gen_random_uuid()")
    private UUID id;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "platform", length = 50)
    private String platform;

    @Column(name = "course_name", length = 255, nullable = false)
    private String courseName;

    @Column(name = "duration_weeks")
    private Integer durationWeeks;

    @Column(name = "completion_date")
    private LocalDate completionDate;

    @Column(name = "certificate_url", length = 500)
    private String certificateUrl;

    @Column(name = "status", length = 30)
    @Builder.Default
    private String status = "Pending";

    @CreationTimestamp
    @Column(name = "submitted_at", updatable = false)
    private LocalDateTime submittedAt;
}
