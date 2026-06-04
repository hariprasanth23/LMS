package com.college.lms.repository;

import com.college.lms.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {

    Optional<Course> findByCode(String code);

    List<Course> findByDepartmentId(Long departmentId);

    List<Course> findByFacultyId(UUID facultyId);

    List<Course> findByStatus(String status);

    boolean existsByCode(String code);
}
