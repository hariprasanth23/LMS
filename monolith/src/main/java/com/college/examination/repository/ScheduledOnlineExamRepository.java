package com.college.examination.repository;

import com.college.examination.model.ScheduledOnlineExam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ScheduledOnlineExamRepository extends JpaRepository<ScheduledOnlineExam, UUID> {
    List<ScheduledOnlineExam> findByStudentIdOrderByExamDate(UUID studentId);
}
