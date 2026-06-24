package com.lms.research.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "weekly_logs",
       uniqueConstraints = @UniqueConstraint(columnNames = {"research_id", "week_number"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WeeklyLog {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;

    @Column(name = "research_id", nullable = false) private UUID researchId;
    @Column(name = "week_number", nullable = false) private Integer weekNumber;
    @Column(name = "hours_worked")                  private Integer hoursWorked;
    @Column(name = "work_summary", columnDefinition = "TEXT") private String workSummary;

    @CreationTimestamp @Column(name = "submitted_at", updatable = false)
    private Instant submittedAt;
}
