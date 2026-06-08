package com.college.examination.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(schema = "examination", name = "exam_schedule")
public class ExamSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid DEFAULT gen_random_uuid()")
    private UUID id;

    @Column(name = "course_code", length = 20, nullable = false)
    private String courseCode;

    @Column(name = "course_name", length = 200, nullable = false)
    private String courseName;

    @Column(name = "exam_date", nullable = false)
    private LocalDate examDate;

    @Column(name = "time_slot", length = 50)
    private String timeSlot;

    @Column(name = "venue", length = 100)
    private String venue;

    @Column(name = "exam_type", length = 50)
    @Builder.Default
    private String examType = "End Semester";

    @Column(name = "semester")
    private Integer semester;

    @Column(name = "batch", length = 10)
    private String batch;

    @Column(name = "department_code", length = 20)
    private String departmentCode;
}
