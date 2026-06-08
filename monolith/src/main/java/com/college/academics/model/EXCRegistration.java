package com.college.academics.model;

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
@Table(schema = "student", name = "exc_registrations",
    uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_code"}))
public class EXCRegistration {

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

    @Column(name = "faculty", length = 150)
    private String faculty;

    @Column(name = "credits")
    private Integer credits;

    @Column(name = "semester")
    private Integer semester;

    @Column(name = "status", length = 30)
    @Builder.Default
    private String status = "Approved";

    @CreationTimestamp
    @Column(name = "registered_at", updatable = false)
    private LocalDateTime registeredAt;
}
