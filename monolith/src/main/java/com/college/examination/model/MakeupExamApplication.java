package com.college.examination.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(schema = "examination", name = "makeup_exam_applications")
public class MakeupExamApplication {

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

    @Column(name = "reason", length = 100)
    private String reason;

    @Column(name = "absence_date")
    private LocalDate absenceDate;

    @Column(name = "detailed_reason", columnDefinition = "TEXT")
    private String detailedReason;

    @Column(name = "supporting_doc", length = 255)
    private String supportingDoc;

    @Column(name = "status", length = 20)
    @Builder.Default
    private String status = "Pending";

    @Column(name = "makeup_date")
    private LocalDate makeupDate;

    @Column(name = "makeup_time", length = 30)
    private String makeupTime;

    @Column(name = "makeup_venue", length = 100)
    private String makeupVenue;

    @CreationTimestamp
    @Column(name = "applied_at", updatable = false)
    private LocalDateTime appliedAt;
}
