package com.lms.attendance.repository;

import com.lms.attendance.model.EmployeeAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EmployeeAttendanceRepository extends JpaRepository<EmployeeAttendance, UUID> {
    List<EmployeeAttendance> findByEmployeeIdOrderByDateDesc(UUID employeeId);
}
