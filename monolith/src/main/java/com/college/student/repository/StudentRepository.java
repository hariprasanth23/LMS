package com.college.student.repository;

import com.college.student.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentRepository extends JpaRepository<Student, UUID> {

    Optional<Student> findByRollNumber(String rollNumber);

    Optional<Student> findByUserId(UUID userId);

    List<Student> findByDepartmentId(Long departmentId);

    List<Student> findByStatus(String status);

    boolean existsByRollNumber(String rollNumber);
}
