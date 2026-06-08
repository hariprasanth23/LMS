package com.college.academics.repository;

import com.college.academics.model.ProjectApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProjectApplicationRepository extends JpaRepository<ProjectApplication, UUID> {
    List<ProjectApplication> findByStudentIdOrderByAppliedAtDesc(UUID studentId);
    boolean existsByStudentIdAndProjectRefId(UUID studentId, Long projectRefId);
}
