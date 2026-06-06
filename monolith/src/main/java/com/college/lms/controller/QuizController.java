package com.college.lms.controller;

import com.college.auth.model.User;
import com.college.common.dto.ApiResponse;
import com.college.lms.dto.QuizAttemptRequest;
import com.college.lms.dto.QuizQuestionRequest;
import com.college.lms.dto.QuizRequest;
import com.college.lms.model.Quiz;
import com.college.lms.model.QuizAttempt;
import com.college.lms.model.QuizQuestion;
import com.college.lms.service.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<ApiResponse<List<Quiz>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(quizService.findAll()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<ApiResponse<Quiz>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(quizService.findById(id)));
    }

    @PostMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<ApiResponse<Quiz>> create(@PathVariable UUID courseId,
                                                    @Valid @RequestBody QuizRequest request) {
        Quiz quiz = quizService.create(courseId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Quiz created", quiz));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<ApiResponse<Quiz>> update(@PathVariable UUID id,
                                                    @Valid @RequestBody QuizRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Quiz updated", quizService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        quizService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Quiz deleted", null));
    }

    @GetMapping("/{id}/questions")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<ApiResponse<List<QuizQuestion>>> getQuestions(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(quizService.getQuestions(id)));
    }

    @PostMapping("/{id}/questions")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<ApiResponse<QuizQuestion>> addQuestion(@PathVariable UUID id,
                                                                  @Valid @RequestBody QuizQuestionRequest request) {
        QuizQuestion question = quizService.addQuestion(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Question added", question));
    }

    @PostMapping("/{id}/attempt")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<QuizAttempt>> attempt(@PathVariable UUID id,
                                                             @Valid @RequestBody QuizAttemptRequest request,
                                                             @AuthenticationPrincipal User currentUser) {
        QuizAttempt attempt = quizService.attempt(id, currentUser, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Quiz submitted", attempt));
    }
}
