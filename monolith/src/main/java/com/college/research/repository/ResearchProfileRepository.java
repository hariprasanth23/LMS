package com.college.research.repository;

import com.college.research.model.ResearchProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ResearchProfileRepository extends JpaRepository<ResearchProfile, UUID> {
    Optional<ResearchProfile> findByStudentId(UUID studentId);
}
