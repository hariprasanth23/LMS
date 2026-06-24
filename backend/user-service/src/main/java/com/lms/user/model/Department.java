package com.lms.user.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "departments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Department {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)              private String name;
    @Column(nullable = false, unique = true, length = 20) private String code;
    @Column(columnDefinition = "TEXT")                    private String description;
    @Column(name = "head_faculty_id")                     private UUID headFacultyId;
    private String email;
    @Column(length = 20)                                   private String phone;
    private String location;
    @Column(name = "established_year")                    private Integer establishedYear;
    @Column(name = "total_seats")                         private Integer totalSeats;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}
