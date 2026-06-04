package com.college.attendance.repository;

import com.college.attendance.model.EmployeeAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmployeeAttendanceRepository extends JpaRepository<EmployeeAttendance, UUID> {

    List<EmployeeAttendance> findByEmployeeIdOrderByDateDesc(UUID employeeId);

    Optional<EmployeeAttendance> findByEmployeeIdAndDate(UUID employeeId, LocalDate date);

    boolean existsByEmployeeIdAndDate(UUID employeeId, LocalDate date);
}
