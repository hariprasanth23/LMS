package com.college.lms.service;

import com.college.lms.dto.CourseRequest;
import com.college.lms.model.Course;
import com.college.lms.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;

    public List<Course> findAll(Pageable pageable) {
        return courseRepository.findAll(pageable).getContent();
    }

    public Course findById(UUID id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Course not found with id: " + id));
    }

    @Transactional
    public Course create(CourseRequest request) {
        if (courseRepository.existsByCode(request.getCode())) {
            throw new IllegalStateException("Course with code '" + request.getCode() + "' already exists");
        }
        Course course = Course.builder()
                .code(request.getCode().toUpperCase())
                .name(request.getName())
                .description(request.getDescription())
                .departmentId(request.getDepartmentId())
                .credits(request.getCredits())
                .semester(request.getSemester())
                .facultyId(request.getFacultyId())
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .build();
        return courseRepository.save(course);
    }

    @Transactional
    public Course update(UUID id, CourseRequest request) {
        Course course = findById(id);
        if (!course.getCode().equals(request.getCode()) && courseRepository.existsByCode(request.getCode())) {
            throw new IllegalStateException("Course with code '" + request.getCode() + "' already exists");
        }
        course.setCode(request.getCode().toUpperCase());
        course.setName(request.getName());
        course.setDescription(request.getDescription());
        course.setDepartmentId(request.getDepartmentId());
        course.setCredits(request.getCredits());
        course.setSemester(request.getSemester());
        course.setFacultyId(request.getFacultyId());
        if (request.getStatus() != null) course.setStatus(request.getStatus());
        return courseRepository.save(course);
    }

    @Transactional
    public void delete(UUID id) {
        Course course = findById(id);
        courseRepository.delete(course);
    }
}
