package com.college.services.repository;

import com.college.services.model.StudentServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface StudentServiceRequestRepository extends JpaRepository<StudentServiceRequest, UUID> {
    List<StudentServiceRequest> findByStudentIdAndRequestTypeOrderBySubmittedAtDesc(UUID studentId, String requestType);
    List<StudentServiceRequest> findByStudentIdOrderBySubmittedAtDesc(UUID studentId);
}
