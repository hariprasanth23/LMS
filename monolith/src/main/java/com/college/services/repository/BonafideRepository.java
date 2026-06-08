package com.college.services.repository;

import com.college.services.model.BonafideApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BonafideRepository extends JpaRepository<BonafideApplication, UUID> {
    List<BonafideApplication> findByStudentIdOrderByAppliedAtDesc(UUID studentId);
}
