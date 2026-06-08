package com.college.research.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(schema = "research", name = "research_profiles",
    uniqueConstraints = @UniqueConstraint(columnNames = "student_id"))
public class ResearchProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid DEFAULT gen_random_uuid()")
    private UUID id;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "scholar_id", length = 30, unique = true)
    private String scholarId;

    @Column(name = "programme", length = 50)
    private String programme;

    @Column(name = "area_of_research", length = 200)
    private String areaOfResearch;

    @Column(name = "registration_date")
    private LocalDate registrationDate;

    @Column(name = "guide_name", length = 150)
    private String guideName;

    @Column(name = "co_guide_name", length = 150)
    private String coGuideName;

    @Column(name = "status", length = 30)
    @Builder.Default
    private String status = "Active";

    @Column(name = "publications")
    @Builder.Default
    private Integer publications = 0;

    @Column(name = "conferences")
    @Builder.Default
    private Integer conferences = 0;

    @Column(name = "patents")
    @Builder.Default
    private Integer patents = 0;

    @Column(name = "course_work_credits")
    @Builder.Default
    private Integer courseWorkCredits = 0;

    @Column(name = "total_required_credits")
    @Builder.Default
    private Integer totalRequiredCredits = 20;
}
