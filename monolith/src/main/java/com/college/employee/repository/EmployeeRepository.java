package com.college.employee.repository;

import com.college.employee.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, UUID> {

    Optional<Employee> findByUserId(UUID userId);

    Optional<Employee> findByEmpCode(String empCode);

    List<Employee> findByDepartmentId(Long departmentId);

    List<Employee> findByStatus(String status);

    boolean existsByEmpCode(String empCode);
}
