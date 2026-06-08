package com.college.services.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(schema = "services", name = "bonafide_applications")
public class BonafideApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid DEFAULT gen_random_uuid()")
    private UUID id;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "application_number", length = 30, unique = true)
    private String applicationNumber;

    @Column(name = "purpose", length = 100)
    private String purpose;

    @Column(name = "addressed_to", length = 200)
    private String addressedTo;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "language", length = 20)
    @Builder.Default
    private String language = "English";

    @Column(name = "copies")
    @Builder.Default
    private Integer copies = 1;

    @Column(name = "urgency", length = 20)
    @Builder.Default
    private String urgency = "Normal";

    @Column(name = "status", length = 50)
    @Builder.Default
    private String status = "Processing";

    @CreationTimestamp
    @Column(name = "applied_at", updatable = false)
    private LocalDateTime appliedAt;
}
