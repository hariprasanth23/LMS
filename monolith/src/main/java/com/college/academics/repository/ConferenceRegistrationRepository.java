package com.college.academics.repository;

import com.college.academics.model.ConferenceRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ConferenceRegistrationRepository extends JpaRepository<ConferenceRegistration, UUID> {
    List<ConferenceRegistration> findByStudentIdOrderByRegisteredAtDesc(UUID studentId);
}
