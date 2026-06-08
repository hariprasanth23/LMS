package com.college.academics.model;

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
@Table(schema = "student", name = "conference_registrations")
public class ConferenceRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid DEFAULT gen_random_uuid()")
    private UUID id;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "conference_name", length = 255, nullable = false)
    private String conferenceName;

    @Column(name = "venue", length = 255)
    private String venue;

    @Column(name = "conference_date")
    private LocalDate conferenceDate;

    @Column(name = "submission_deadline")
    private LocalDate submissionDeadline;

    @Column(name = "paper_title", length = 500)
    private String paperTitle;

    @Column(name = "co_authors", length = 500)
    private String coAuthors;

    @Column(name = "abstract_url", length = 500)
    private String abstractUrl;

    @Column(name = "status", length = 30)
    @Builder.Default
    private String status = "Registered";

    @CreationTimestamp
    @Column(name = "registered_at", updatable = false)
    private LocalDateTime registeredAt;
}
