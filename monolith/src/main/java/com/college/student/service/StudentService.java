package com.college.student.service;

import com.college.auth.model.User;
import com.college.student.dto.StudentRequest;
import com.college.student.model.Department;
import com.college.student.model.Student;
import com.college.student.repository.DepartmentRepository;
import com.college.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;

    @Transactional(readOnly = true)
    public List<Student> findAll(Pageable pageable) {
        return studentRepository.findAll(pageable).getContent();
    }

    @Transactional(readOnly = true)
    public Student findById(UUID id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Student findByUserId(UUID userId) {
        return studentRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found for user: " + userId));
    }

    @Transactional(readOnly = true)
    public Student findOwnProfile(User currentUser) {
        return findByUserId(currentUser.getId());
    }

    @Transactional
    public Student create(StudentRequest request) {
        if (studentRepository.existsByRollNumber(request.getRollNumber())) {
            throw new IllegalStateException("Student with roll number '" + request.getRollNumber() + "' already exists");
        }
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Department not found with id: " + request.getDepartmentId()));

        Student student = Student.builder()
                .userId(request.getUserId())
                .rollNumber(request.getRollNumber())
                .department(department)
                .semester(request.getSemester())
                .batch(request.getBatch())
                .joinDate(request.getJoinDate())
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .guardianName(request.getGuardianName())
                .guardianPhone(request.getGuardianPhone())
                .address(request.getAddress())
                .build();
        return studentRepository.save(student);
    }

    @Transactional
    public Student update(UUID id, StudentRequest request) {
        Student student = findById(id);
        if (!student.getRollNumber().equals(request.getRollNumber())
                && studentRepository.existsByRollNumber(request.getRollNumber())) {
            throw new IllegalStateException("Student with roll number '" + request.getRollNumber() + "' already exists");
        }
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Department not found with id: " + request.getDepartmentId()));

        student.setUserId(request.getUserId());
        student.setRollNumber(request.getRollNumber());
        student.setDepartment(department);
        student.setSemester(request.getSemester());
        student.setBatch(request.getBatch());
        student.setJoinDate(request.getJoinDate());
        if (request.getStatus() != null) student.setStatus(request.getStatus());
        student.setGuardianName(request.getGuardianName());
        student.setGuardianPhone(request.getGuardianPhone());
        student.setAddress(request.getAddress());
        return studentRepository.save(student);
    }

    @Transactional
    public void delete(UUID id) {
        Student student = findById(id);
        studentRepository.delete(student);
    }
}
