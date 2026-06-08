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
@Table(
    schema = "feedback",
    name = "course_feedback",
    uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_code", "semester"})
)
public class CourseFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid DEFAULT gen_random_uuid()")
    private UUID id;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "course_code", length = 20, nullable = false)
    private String courseCode;

    @Column(name = "course_name", length = 200)
    private String courseName;

    @Column(name = "faculty_name", length = 150)
    private String facultyName;

    @Column(name = "semester", nullable = false)
    private Integer semester;

    @Column(name = "content_delivery")
    private Integer contentDelivery;

    @Column(name = "teaching_clarity")
    private Integer teachingClarity;

    @Column(name = "student_engagement")
    private Integer studentEngagement;

    @Column(name = "use_of_technology")
    private Integer useOfTechnology;

    @Column(name = "availability_for_doubts")
    private Integer availabilityForDoubts;

    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;

    @CreationTimestamp
    @Column(name = "submitted_at", updatable = false)
    private LocalDateTime submittedAt;
}
