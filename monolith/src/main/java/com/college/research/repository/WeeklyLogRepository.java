package com.college.research.repository;

import com.college.research.model.WeeklyLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface WeeklyLogRepository extends JpaRepository<WeeklyLog, UUID> {
    List<WeeklyLog> findByStudentIdOrderBySubmittedAtDesc(UUID studentId);
}
