package com.college.student.service;

import com.college.student.dto.EnrollmentRequest;
import com.college.student.model.Enrollment;
import com.college.student.repository.EnrollmentRepository;
import com.college.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;

    @Transactional
    public Enrollment enroll(EnrollmentRequest request) {
        if (!studentRepository.existsById(request.getStudentId())) {
            throw new IllegalArgumentException("Student not found with id: " + request.getStudentId());
        }
        if (enrollmentRepository.existsByStudentIdAndCourseId(request.getStudentId(), request.getCourseId())) {
            throw new IllegalStateException("Student is already enrolled in this course");
        }
        Enrollment enrollment = Enrollment.builder()
                .studentId(request.getStudentId())
                .courseId(request.getCourseId())
                .build();
        return enrollmentRepository.save(enrollment);
    }

    public List<Enrollment> findByStudent(UUID studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }

    public List<Enrollment> findByCourse(UUID courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }

    @Transactional
    public Enrollment updateStatus(UUID enrollmentId, String status, String grade) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new IllegalArgumentException("Enrollment not found with id: " + enrollmentId));
        if (status != null) enrollment.setStatus(status);
        if (grade != null) enrollment.setGrade(grade);
        return enrollmentRepository.save(enrollment);
    }
}
