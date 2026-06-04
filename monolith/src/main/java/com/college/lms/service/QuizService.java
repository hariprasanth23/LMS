package com.college.lms.service;

import com.college.auth.model.User;
import com.college.lms.dto.QuizAttemptRequest;
import com.college.lms.dto.QuizQuestionRequest;
import com.college.lms.dto.QuizRequest;
import com.college.lms.model.Quiz;
import com.college.lms.model.QuizAttempt;
import com.college.lms.model.QuizQuestion;
import com.college.lms.repository.CourseRepository;
import com.college.lms.repository.QuizAttemptRepository;
import com.college.lms.repository.QuizQuestionRepository;
import com.college.lms.repository.QuizRepository;
import com.college.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuizQuestionRepository questionRepository;
    private final QuizAttemptRepository attemptRepository;
    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;

    public List<Quiz> findAll() {
        return quizRepository.findAll();
    }

    public Quiz findById(UUID id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found with id: " + id));
    }

    @Transactional
    public Quiz create(UUID courseId, QuizRequest request) {
        if (!courseRepository.existsById(courseId)) {
            throw new IllegalArgumentException("Course not found with id: " + courseId);
        }
        Quiz quiz = Quiz.builder()
                .courseId(courseId)
                .title(request.getTitle())
                .description(request.getDescription())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .durationMinutes(request.getDurationMinutes())
                .totalMarks(request.getTotalMarks())
                .status(request.getStatus() != null ? request.getStatus() : "DRAFT")
                .build();
        return quizRepository.save(quiz);
    }

    @Transactional
    public Quiz update(UUID id, QuizRequest request) {
        Quiz quiz = findById(id);
        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setStartTime(request.getStartTime());
        quiz.setEndTime(request.getEndTime());
        quiz.setDurationMinutes(request.getDurationMinutes());
        quiz.setTotalMarks(request.getTotalMarks());
        if (request.getStatus() != null) quiz.setStatus(request.getStatus());
        return quizRepository.save(quiz);
    }

    @Transactional
    public void delete(UUID id) {
        quizRepository.delete(findById(id));
    }

    public List<QuizQuestion> getQuestions(UUID quizId) {
        if (!quizRepository.existsById(quizId)) {
            throw new IllegalArgumentException("Quiz not found with id: " + quizId);
        }
        return questionRepository.findByQuizId(quizId);
    }

    @Transactional
    public QuizQuestion addQuestion(UUID quizId, QuizQuestionRequest request) {
        if (!quizRepository.existsById(quizId)) {
            throw new IllegalArgumentException("Quiz not found with id: " + quizId);
        }
        QuizQuestion question = QuizQuestion.builder()
                .quizId(quizId)
                .question(request.getQuestion())
                .optionA(request.getOptionA())
                .optionB(request.getOptionB())
                .optionC(request.getOptionC())
                .optionD(request.getOptionD())
                .correctOption(request.getCorrectOption())
                .marks(request.getMarks() != null ? request.getMarks() : 1)
                .build();
        return questionRepository.save(question);
    }

    @Transactional
    public QuizAttempt attempt(UUID quizId, User currentUser, QuizAttemptRequest request) {
        Quiz quiz = findById(quizId);
        if (!"PUBLISHED".equals(quiz.getStatus())) {
            throw new IllegalStateException("Quiz is not available for attempts");
        }

        var student = studentRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found for current user"));

        if (attemptRepository.existsByQuizIdAndStudentId(quizId, student.getId())) {
            throw new IllegalStateException("You have already attempted this quiz");
        }

        List<QuizQuestion> questions = questionRepository.findByQuizId(quizId);
        Map<UUID, QuizQuestion> questionMap = questions.stream()
                .collect(Collectors.toMap(QuizQuestion::getId, q -> q));

        int score = 0;
        for (Map.Entry<UUID, String> entry : request.getAnswers().entrySet()) {
            QuizQuestion q = questionMap.get(entry.getKey());
            if (q != null && q.getCorrectOption() != null && q.getCorrectOption().equals(entry.getValue())) {
                score += q.getMarks() != null ? q.getMarks() : 1;
            }
        }

        QuizAttempt attempt = QuizAttempt.builder()
                .quizId(quizId)
                .studentId(student.getId())
                .score(score)
                .build();
        return attemptRepository.save(attempt);
    }
}
