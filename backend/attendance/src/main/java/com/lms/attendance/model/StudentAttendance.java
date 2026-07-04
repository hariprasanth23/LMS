package com.lms.attendance.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "student_attendance",
       uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_id", "date"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StudentAttendance {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "student_id", nullable = false) private UUID studentId;
    @Column(name = "course_id",  nullable = false) private UUID courseId;
    @Column(nullable = false)                       private LocalDate date;
    @Column(nullable = false, length = 10)          private String status;  // PRESENT / ABSENT / LATE
    @Column(name = "marked_by") private UUID markedBy;
    @CreationTimestamp @Column(name = "marked_at", updatable = false) private Instant markedAt;
}
