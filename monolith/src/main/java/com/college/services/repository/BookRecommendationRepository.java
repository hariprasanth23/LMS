package com.college.services.repository;

import com.college.services.model.BookRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BookRecommendationRepository extends JpaRepository<BookRecommendation, UUID> {
    List<BookRecommendation> findByStudentIdOrderBySubmittedAtDesc(UUID studentId);
}
