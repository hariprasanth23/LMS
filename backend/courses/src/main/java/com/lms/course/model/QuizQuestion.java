package com.lms.course.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.UUID;

@Entity @Table(name = "quiz_questions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class QuizQuestion {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "quiz_id", nullable = false) private UUID quizId;
    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT") private String questionText;
    @JdbcTypeCode(SqlTypes.JSON) @Column(columnDefinition = "jsonb") private String options;
    @Column(name = "correct_answer", nullable = false, columnDefinition = "TEXT") private String correctAnswer;
    @Builder.Default @Column(nullable = false) private Integer marks = 1;
}
