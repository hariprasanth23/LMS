package com.college.examination.repository;

import com.college.examination.model.ArrearRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ArrearRegistrationRepository extends JpaRepository<ArrearRegistration, UUID> {
    List<ArrearRegistration> findByStudentIdOrderByRegisteredAtDesc(UUID studentId);
    boolean existsByStudentIdAndCourseCode(UUID studentId, String courseCode);
}
