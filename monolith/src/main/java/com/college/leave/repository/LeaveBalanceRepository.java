package com.college.leave.repository;

import com.college.leave.model.LeaveBalance;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Long> {

    Optional<LeaveBalance> findByEmployeeIdAndYear(UUID employeeId, Integer year);

    Optional<LeaveBalance> findByEmployeeId(UUID employeeId);

    /** Pessimistic write lock — used during leave approval to prevent concurrent balance races. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT lb FROM LeaveBalance lb WHERE lb.employeeId = :employeeId AND lb.year = :year")
    Optional<LeaveBalance> findByEmployeeIdAndYearForUpdate(
            @Param("employeeId") UUID employeeId,
            @Param("year") Integer year);
}
