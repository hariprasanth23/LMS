package com.lms.research.repository;

import com.lms.research.model.WeeklyLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WeeklyLogRepository extends JpaRepository<WeeklyLog, UUID> {
    List<WeeklyLog> findByResearchIdOrderByWeekNumberDesc(UUID researchId);
    boolean existsByResearchIdAndWeekNumber(UUID researchId, Integer weekNumber);
}
