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
@Table(schema = "examination", name = "scheduled_online_exams")
public class ScheduledOnlineExam {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid DEFAULT gen_random_uuid()")
    private UUID id;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "subject_code", length = 20)
    private String subjectCode;

    @Column(name = "subject_name", length = 200)
    private String subjectName;

    @Column(name = "exam_date")
    private LocalDate examDate;

    @Column(name = "time_slot", length = 50)
    private String timeSlot;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "max_marks")
    private Integer maxMarks;

    @Column(name = "status", length = 30)
    @Builder.Default
    private String status = "Scheduled";
}
