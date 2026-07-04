package com.lms.course.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity @Table(name = "courses")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Course {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(nullable = false, unique = true, length = 20) private String code;
    @Column(nullable = false) private String name;
    @Column(columnDefinition = "TEXT") private String description;
    @Column(name = "department_id") private Long departmentId;
    private Integer credits;
    private Integer semester;
    @Column(name = "faculty_id") private UUID facultyId;
    @Builder.Default
    @Column(nullable = false, length = 20) private String status = "ACTIVE";
    @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
}
