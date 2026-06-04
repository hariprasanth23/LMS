package com.college.attendance.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
    schema = "attendance",
    name = "student_attendance",
    uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_id", "date"})
)
public class StudentAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid DEFAULT gen_random_uuid()")
    private UUID id;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "course_id", nullable = false)
    private UUID courseId;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "status", length = 20, nullable = false)
    private String status;

    @Column(name = "marked_by", nullable = false)
    private UUID markedBy;

    @Builder.Default
    @Column(name = "marked_at")
    private LocalDateTime markedAt = LocalDateTime.now();
}
