package com.lms.course.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "enrollments", uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Enrollment {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "student_id", nullable = false) private UUID studentId;
    @Column(name = "course_id",  nullable = false) private UUID courseId;
    @Column(name = "enrollment_date", nullable = false) private LocalDate enrollmentDate;
    @Builder.Default @Column(nullable = false, length = 20) private String status = "ACTIVE";
    @Column(length = 5) private String grade;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
}
