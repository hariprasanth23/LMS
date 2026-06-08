package com.college.academics.repository;

import com.college.academics.model.MOOCSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MOOCSubmissionRepository extends JpaRepository<MOOCSubmission, UUID> {
    List<MOOCSubmission> findByStudentIdOrderBySubmittedAtDesc(UUID studentId);
}
