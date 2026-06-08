package com.college.student.repository;

import com.college.student.model.StudentBankInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface StudentBankInfoRepository extends JpaRepository<StudentBankInfo, UUID> {
    Optional<StudentBankInfo> findByStudentId(UUID studentId);
}
