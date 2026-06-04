package com.college.lms.service;

import com.college.auth.model.User;
import com.college.lms.dto.AssignmentRequest;
import com.college.lms.dto.GradeRequest;
import com.college.lms.dto.SubmissionRequest;
import com.college.lms.model.Assignment;
import com.college.lms.model.AssignmentSubmission;
import com.college.lms.repository.AssignmentRepository;
import com.college.lms.repository.AssignmentSubmissionRepository;
import com.college.lms.repository.CourseRepository;
import com.college.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository submissionRepository;
    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;

    public List<Assignment> findByCourse(UUID courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new IllegalArgumentException("Course not found with id: " + courseId);
        }
        return assignmentRepository.findByCourseId(courseId);
    }

    public Assignment findById(UUID id) {
        return assignmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found with id: " + id));
    }

    @Transactional
    public Assignment create(UUID courseId, AssignmentRequest request) {
        if (!courseRepository.existsById(courseId)) {
            throw new IllegalArgumentException("Course not found with id: " + courseId);
        }
        Assignment assignment = Assignment.builder()
                .courseId(courseId)
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .maxMarks(request.getMaxMarks() != null ? request.getMaxMarks() : 100)
                .build();
        return assignmentRepository.save(assignment);
    }

    @Transactional
    public AssignmentSubmission submit(UUID assignmentId, User currentUser, SubmissionRequest request) {
        Assignment assignment = findById(assignmentId);
        // Look up the student record for current user
        var student = studentRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found for current user"));

        if (submissionRepository.existsByAssignmentIdAndStudentId(assignmentId, student.getId())) {
            throw new IllegalStateException("You have already submitted this assignment");
        }
        AssignmentSubmission submission = AssignmentSubmission.builder()
                .assignmentId(assignmentId)
                .studentId(student.getId())
                .fileUrl(request.getFileUrl())
                .content(request.getContent())
                .build();
        return submissionRepository.save(submission);
    }

    public List<AssignmentSubmission> getSubmissions(UUID assignmentId) {
        if (!assignmentRepository.existsById(assignmentId)) {
            throw new IllegalArgumentException("Assignment not found with id: " + assignmentId);
        }
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    @Transactional
    public AssignmentSubmission grade(UUID submissionId, GradeRequest request) {
        AssignmentSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found with id: " + submissionId));
        submission.setMarks(request.getMarks());
        submission.setFeedback(request.getFeedback());
        submission.setStatus("GRADED");
        return submissionRepository.save(submission);
    }
}
