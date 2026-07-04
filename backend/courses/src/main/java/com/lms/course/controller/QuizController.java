package com.lms.course.controller;

import com.lms.course.common.ApiResponse;
import com.lms.course.model.Quiz;
import com.lms.course.model.QuizAttempt;
import com.lms.course.model.QuizQuestion;
import com.lms.course.repository.CourseRepositories.QuizAttemptRepository;
import com.lms.course.repository.CourseRepositories.QuizQuestionRepository;
import com.lms.course.repository.CourseRepositories.QuizRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizRepository         quizRepo;
    private final QuizQuestionRepository questionRepo;
    private final QuizAttemptRepository  attemptRepo;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Quiz>>> all() {
        return ResponseEntity.ok(ApiResponse.success("OK", quizRepo.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Quiz>> byId(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                quizRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Quiz not found"))));
    }

    @PostMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<Quiz>> create(
            @RequestHeader("X-User-Role") String role,
            @PathVariable UUID courseId, @Valid @RequestBody QuizReq req) {
        requireAdminOrFaculty(role);
        Quiz saved = quizRepo.save(Quiz.builder()
                .courseId(courseId).title(req.getTitle()).description(req.getDescription())
                .durationMinutes(req.getDurationMinutes()).totalMarks(req.getTotalMarks()).build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Created", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Quiz>> update(
            @RequestHeader("X-User-Role") String role,
            @PathVariable UUID id, @Valid @RequestBody QuizReq req) {
        requireAdminOrFaculty(role);
        Quiz q = quizRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Quiz not found"));
        q.setTitle(req.getTitle()); q.setDescription(req.getDescription());
        q.setDurationMinutes(req.getDurationMinutes()); q.setTotalMarks(req.getTotalMarks());
        return ResponseEntity.ok(ApiResponse.success("Updated", quizRepo.save(q)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @RequestHeader("X-User-Role") String role, @PathVariable UUID id) {
        requireAdminOrFaculty(role);
        quizRepo.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted"));
    }

    @GetMapping("/{id}/questions")
    public ResponseEntity<ApiResponse<List<QuizQuestion>>> questions(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("OK", questionRepo.findByQuizId(id)));
    }

    @PostMapping("/{id}/questions")
    public ResponseEntity<ApiResponse<QuizQuestion>> addQuestion(
            @RequestHeader("X-User-Role") String role,
            @PathVariable UUID id, @Valid @RequestBody QuestionReq req) {
        requireAdminOrFaculty(role);
        QuizQuestion saved = questionRepo.save(QuizQuestion.builder()
                .quizId(id).questionText(req.getQuestionText()).options(req.getOptions())
                .correctAnswer(req.getCorrectAnswer()).marks(req.getMarks() != null ? req.getMarks() : 1)
                .build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Added", saved));
    }

    @PostMapping("/{id}/attempt")
    public ResponseEntity<ApiResponse<QuizAttempt>> attempt(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID id, @Valid @RequestBody AttemptReq req) {
        UUID sid = UUID.fromString(userId);
        if (attemptRepo.existsByQuizIdAndStudentId(id, sid))
            throw new IllegalStateException("Already attempted");
        QuizAttempt saved = attemptRepo.save(QuizAttempt.builder()
                .quizId(id).studentId(sid).answers(req.getAnswers()).score(req.getScore())
                .build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Submitted", saved));
    }

    @Data public static class QuizReq {
        @NotBlank private String title;
        private String description;
        private Integer durationMinutes;
        private Integer totalMarks;
    }
    @Data public static class QuestionReq {
        @NotBlank private String questionText;
        private String options;  // JSON string
        @NotBlank private String correctAnswer;
        private Integer marks;
    }
    @Data public static class AttemptReq {
        private String answers;  // JSON string
        private Integer score;
    }

    private static void requireAdminOrFaculty(String role) {
        if (!"ADMIN".equals(role) && !"FACULTY".equals(role))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin or faculty role required");
    }
}
