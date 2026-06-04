package com.college.lms.repository;

import com.college.lms.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, UUID> {

    List<QuizAttempt> findByQuizId(UUID quizId);

    List<QuizAttempt> findByStudentId(UUID studentId);

    Optional<QuizAttempt> findByQuizIdAndStudentId(UUID quizId, UUID studentId);

    boolean existsByQuizIdAndStudentId(UUID quizId, UUID studentId);
}
