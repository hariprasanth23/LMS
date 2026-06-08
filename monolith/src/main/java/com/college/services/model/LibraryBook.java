package com.college.services.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(schema = "services", name = "library_books")
public class LibraryBook {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid DEFAULT gen_random_uuid()")
    private UUID id;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "title", length = 255, nullable = false)
    private String title;

    @Column(name = "author", length = 200)
    private String author;

    @Column(name = "isbn", length = 30)
    private String isbn;

    @Column(name = "issue_date")
    private LocalDate issueDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "renewals_used")
    @Builder.Default
    private Integer renewalsUsed = 0;

    @Column(name = "max_renewals")
    @Builder.Default
    private Integer maxRenewals = 2;

    @Column(name = "returned")
    @Builder.Default
    private Boolean returned = false;
}
