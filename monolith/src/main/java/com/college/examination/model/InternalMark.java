package com.college.examination.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(
    schema = "examination",
    name = "internal_marks",
    uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_code", "semester"})
)
public class InternalMark {

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

    @Column(name = "ca1")
    private Integer ca1;

    @Column(name = "ca2")
    private Integer ca2;

    @Column(name = "ca3")
    private Integer ca3;

    @Column(name = "model_exam")
    private Integer modelExam;

    @Column(name = "attendance_mark")
    private Integer attendanceMark;
}
