package com.college.payroll.repository;

import com.college.payroll.model.PayrollRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PayrollRepository extends JpaRepository<PayrollRecord, UUID> {

    List<PayrollRecord> findByMonthAndYearOrderByCreatedAtDesc(Integer month, Integer year);

    List<PayrollRecord> findAllByOrderByYearDescMonthDesc();

    List<PayrollRecord> findByEmployeeIdOrderByYearDescMonthDesc(UUID employeeId);

    Optional<PayrollRecord> findByEmployeeIdAndMonthAndYear(UUID employeeId, Integer month, Integer year);
}
