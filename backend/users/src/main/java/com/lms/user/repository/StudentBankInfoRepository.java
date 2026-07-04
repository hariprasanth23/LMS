package com.lms.user.repository;

import com.lms.user.model.StudentBankInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentBankInfoRepository extends JpaRepository<StudentBankInfo, UUID> {
    Optional<StudentBankInfo> findByStudentId(UUID studentId);
}
