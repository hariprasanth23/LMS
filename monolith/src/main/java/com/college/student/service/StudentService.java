package com.college.student.service;

import com.college.auth.model.User;
import com.college.student.dto.StudentRequest;
import com.college.student.model.Department;
import com.college.student.model.Student;
import com.college.student.repository.DepartmentRepository;
import com.college.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

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
            throw new IllegalStateException(
                    "Student with roll number '" + request.getRollNumber() + "' already exists");
        }
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Department not found with id: " + request.getDepartmentId()));

        return studentRepository.save(applyFields(Student.builder()
                .userId(request.getUserId())
                .rollNumber(request.getRollNumber())
                .department(department)
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .joinDate(request.getJoinDate() != null ? request.getJoinDate() : LocalDate.now())
                .build(), request));
    }

    @Transactional
    public Student update(UUID id, StudentRequest request) {
        Student student = findById(id);
        if (!student.getRollNumber().equals(request.getRollNumber())
                && studentRepository.existsByRollNumber(request.getRollNumber())) {
            throw new IllegalStateException(
                    "Student with roll number '" + request.getRollNumber() + "' already exists");
        }
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Department not found with id: " + request.getDepartmentId()));

        student.setRollNumber(request.getRollNumber());
        student.setDepartment(department);
        if (request.getStatus() != null) student.setStatus(request.getStatus());
        if (request.getJoinDate() != null) student.setJoinDate(request.getJoinDate());

        return studentRepository.save(applyFields(student, request));
    }

    @Transactional
    public void delete(UUID id) {
        studentRepository.delete(findById(id));
    }

    /** Applies all optional fields from a request onto an already-initialised Student instance. */
    private Student applyFields(Student s, StudentRequest r) {
        s.setProgram(r.getProgram());
        s.setSemester(r.getSemester());
        s.setSection(r.getSection());
        s.setBatch(r.getBatch());
        s.setAdmissionYear(r.getAdmissionYear());
        s.setDateOfBirth(r.getDateOfBirth());
        s.setGender(r.getGender());
        s.setBloodGroup(r.getBloodGroup());
        s.setCategory(r.getCategory());
        s.setAadhaarNumber(r.getAadhaarNumber());
        s.setAddress(r.getAddress());
        s.setFatherName(r.getFatherName());
        s.setMotherName(r.getMotherName());
        s.setParentPhone(r.getParentPhone());
        s.setGuardianName(r.getGuardianName());
        s.setGuardianPhone(r.getGuardianPhone());
        s.setEmergencyContactName(r.getEmergencyContactName());
        s.setEmergencyContactPhone(r.getEmergencyContactPhone());
        return s;
    }
}
