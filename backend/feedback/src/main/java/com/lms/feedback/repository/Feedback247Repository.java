package com.lms.feedback.repository;

import com.lms.feedback.model.Feedback247;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface Feedback247Repository extends JpaRepository<Feedback247, UUID> {
    List<Feedback247> findByStudentIdOrderBySubmittedAtDesc(UUID studentId);
}
