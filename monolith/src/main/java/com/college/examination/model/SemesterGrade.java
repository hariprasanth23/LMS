package com.college.examination.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(
    schema = "examination",
    name = "semester_grades",
    uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_code", "semester"})
)
public class SemesterGrade {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid DEFAULT gen_random_uuid()")
    private UUID id;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "course_code", length = 20, nullable = false)
    private String courseCode;

    @Column(name = "course_name", length = 200, nullable = false)
    private String courseName;

    @Column(name = "semester", nullable = false)
    private Integer semester;

    @Column(name = "credits")
    private Integer credits;

    @Column(name = "grade", length = 5)
    private String grade;

    @Column(name = "grade_points", precision = 4, scale = 2)
    private BigDecimal gradePoints;
}
