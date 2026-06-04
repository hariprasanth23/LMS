package com.college.leave.repository;

import com.college.leave.model.LeaveBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Long> {

    Optional<LeaveBalance> findByEmployeeIdAndYear(UUID employeeId, Integer year);

    Optional<LeaveBalance> findByEmployeeId(UUID employeeId);
}
