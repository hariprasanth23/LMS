package com.lms.hr.repository;

import com.lms.hr.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

public class HrRepositories {

    @Repository
    public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, UUID> {
        List<LeaveBalance> findByEmployeeIdAndYear(UUID employeeId, Integer year);
    }

    @Repository
    public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, UUID> {
        List<LeaveRequest> findByEmployeeIdOrderByCreatedAtDesc(UUID employeeId);
        List<LeaveRequest> findAllByOrderByCreatedAtDesc();
    }

    @Repository
    public interface PayrollRepository extends JpaRepository<PayrollRecord, UUID> {
        List<PayrollRecord> findByEmployeeIdOrderByYearDescMonthDesc(UUID employeeId);
        List<PayrollRecord> findByMonthAndYear(Integer month, Integer year);
    }
}
