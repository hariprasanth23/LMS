package com.college.finance.repository;

import com.college.finance.model.FeeRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FeeRecordRepository extends JpaRepository<FeeRecord, UUID> {
    List<FeeRecord> findByStudentIdOrderByDueDateAsc(UUID studentId);
    List<FeeRecord> findByStudentIdAndSemester(UUID studentId, Integer semester);
}
