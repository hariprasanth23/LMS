package com.lms.research.repository;

import com.lms.research.model.ResearchProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResearchProfileRepository extends JpaRepository<ResearchProfile, UUID> {
    Optional<ResearchProfile> findByStudentId(UUID studentId);
}
