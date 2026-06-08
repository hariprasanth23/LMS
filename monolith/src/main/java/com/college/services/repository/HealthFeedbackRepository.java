package com.college.services.repository;

import com.college.services.model.HealthFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface HealthFeedbackRepository extends JpaRepository<HealthFeedback, UUID> {
    List<HealthFeedback> findByUserIdOrderBySubmittedAtDesc(UUID userId);
}
