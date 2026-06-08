package com.college.academics.repository;

import com.college.academics.model.EXCRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EXCRegistrationRepository extends JpaRepository<EXCRegistration, UUID> {
    List<EXCRegistration> findByStudentIdOrderByRegisteredAtDesc(UUID studentId);
    boolean existsByStudentIdAndCourseCode(UUID studentId, String courseCode);
}
