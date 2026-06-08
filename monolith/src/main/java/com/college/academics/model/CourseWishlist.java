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
@Table(
    schema = "student",
    name = "course_wishlist",
    uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_code"})
)
public class CourseWishlist {

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

    @Column(name = "slot", length = 10)
    private String slot;

    @Column(name = "seats_available")
    private Integer seatsAvailable;

    @Column(name = "total_seats")
    private Integer totalSeats;

    @CreationTimestamp
    @Column(name = "added_at", updatable = false)
    private LocalDateTime addedAt;
}
