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
@Table(schema = "student", name = "internship_registrations")
public class InternshipRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid DEFAULT gen_random_uuid()")
    private UUID id;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "company_name", length = 200, nullable = false)
    private String companyName;

    @Column(name = "role", length = 150)
    private String role;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "duration_weeks")
    private Integer durationWeeks;

    @Column(name = "stipend", length = 50)
    private String stipend;

    @Column(name = "mentor_name", length = 150)
    private String mentorName;

    @Column(name = "mentor_email", length = 150)
    private String mentorEmail;

    @Column(name = "offer_letter_url", length = 500)
    private String offerLetterUrl;

    @Column(name = "status", length = 30)
    @Builder.Default
    private String status = "Ongoing";

    @CreationTimestamp
    @Column(name = "registered_at", updatable = false)
    private LocalDateTime registeredAt;
}
