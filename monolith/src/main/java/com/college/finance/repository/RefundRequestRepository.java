package com.college.finance.repository;

import com.college.finance.model.RefundRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RefundRequestRepository extends JpaRepository<RefundRequest, UUID> {
    List<RefundRequest> findByStudentIdOrderByRequestedAtDesc(UUID studentId);
}
