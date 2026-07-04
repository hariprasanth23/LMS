package com.lms.user.repository;

import com.lms.user.model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, UUID> {
    Optional<Employee> findByUserId(UUID userId);
    Optional<Employee> findByEmpCode(String empCode);
    boolean existsByEmpCode(String empCode);
    boolean existsByEmail(String email);
    Page<Employee> findByDepartmentId(Long departmentId, Pageable pageable);
    List<Employee> findByEmployeeType(String employeeType);
}
