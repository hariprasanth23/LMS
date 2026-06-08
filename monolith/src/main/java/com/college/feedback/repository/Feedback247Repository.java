package com.college.feedback.repository;

import com.college.feedback.model.Feedback247;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface Feedback247Repository extends JpaRepository<Feedback247, UUID> {
    List<Feedback247> findByStudentIdOrderBySubmittedAtDesc(UUID studentId);
}
