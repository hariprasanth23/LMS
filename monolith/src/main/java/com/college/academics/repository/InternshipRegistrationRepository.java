package com.college.academics.repository;

import com.college.academics.model.InternshipRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface InternshipRegistrationRepository extends JpaRepository<InternshipRegistration, UUID> {
    List<InternshipRegistration> findByStudentIdOrderByRegisteredAtDesc(UUID studentId);
}
