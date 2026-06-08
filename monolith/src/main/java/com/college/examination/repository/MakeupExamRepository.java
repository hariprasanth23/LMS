package com.college.examination.repository;

import com.college.examination.model.MakeupExamApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MakeupExamRepository extends JpaRepository<MakeupExamApplication, UUID> {
    List<MakeupExamApplication> findByStudentIdOrderByAppliedAtDesc(UUID studentId);
}
