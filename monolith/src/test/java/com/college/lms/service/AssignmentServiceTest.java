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
import com.college.student.model.Student;
import com.college.student.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AssignmentServiceTest {

    @Mock private AssignmentRepository assignmentRepository;
    @Mock private AssignmentSubmissionRepository submissionRepository;
    @Mock private CourseRepository courseRepository;
    @Mock private StudentRepository studentRepository;

    @InjectMocks private AssignmentService assignmentService;

    private UUID courseId;
    private UUID assignmentId;
    private UUID studentId;
    private UUID userId;

    private Assignment savedAssignment;
    private Student student;
    private User currentUser;

    @BeforeEach
    void setUp() {
        courseId     = UUID.randomUUID();
        assignmentId = UUID.randomUUID();
        studentId    = UUID.randomUUID();
        userId       = UUID.randomUUID();

        savedAssignment = Assignment.builder()
                .id(assignmentId)
                .courseId(courseId)
                .title("Homework 1")
                .maxMarks(100)
                .build();

        student = Student.builder()
                .id(studentId)
                .userId(userId)
                .rollNumber("2024CS001")
                .build();

        currentUser = User.builder()
                .id(userId)
                .email("student@college.com")
                .role(User.Role.STUDENT)
                .active(true)
                .build();
    }

    // ── findByCourse ──────────────────────────────────────────────────────────

    @Test
    void findByCourse_courseExists_returnsAssignments() {
        when(courseRepository.existsById(courseId)).thenReturn(true);
        when(assignmentRepository.findByCourseId(courseId)).thenReturn(List.of(savedAssignment));

        List<Assignment> result = assignmentService.findByCourse(courseId);

        assertThat(result).hasSize(1).contains(savedAssignment);
    }

    @Test
    void findByCourse_courseNotFound_throwsIllegalArgument() {
        when(courseRepository.existsById(any())).thenReturn(false);

        assertThatThrownBy(() -> assignmentService.findByCourse(courseId))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Course not found");
    }

    // ── create ────────────────────────────────────────────────────────────────

    @Test
    void create_validRequest_returnsPersistedAssignment() {
        AssignmentRequest req = new AssignmentRequest();
        req.setTitle("Homework 1");
        req.setMaxMarks(50);

        when(courseRepository.existsById(courseId)).thenReturn(true);
        when(assignmentRepository.save(any(Assignment.class))).thenReturn(savedAssignment);

        Assignment result = assignmentService.create(courseId, req);

        assertThat(result.getTitle()).isEqualTo("Homework 1");
        verify(assignmentRepository).save(any(Assignment.class));
    }

    @Test
    void create_defaultsMaxMarksto100_whenNotProvided() {
        AssignmentRequest req = new AssignmentRequest();
        req.setTitle("Homework 1");
        req.setMaxMarks(null);

        when(courseRepository.existsById(courseId)).thenReturn(true);
        when(assignmentRepository.save(any(Assignment.class))).thenReturn(savedAssignment);

        assignmentService.create(courseId, req);

        verify(assignmentRepository).save(argThat(a -> a.getMaxMarks() == 100));
    }

    @Test
    void create_courseNotFound_throwsIllegalArgument() {
        when(courseRepository.existsById(any())).thenReturn(false);

        assertThatThrownBy(() -> assignmentService.create(courseId, new AssignmentRequest()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Course not found");
    }

    // ── submit ────────────────────────────────────────────────────────────────

    @Test
    void submit_firstSubmission_persisted() {
        SubmissionRequest req = new SubmissionRequest();
        req.setContent("My answer");

        AssignmentSubmission saved = AssignmentSubmission.builder()
                .id(UUID.randomUUID())
                .assignmentId(assignmentId)
                .studentId(studentId)
                .content("My answer")
                .status("SUBMITTED")
                .build();

        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.of(savedAssignment));
        when(studentRepository.findByUserId(userId)).thenReturn(Optional.of(student));
        when(submissionRepository.existsByAssignmentIdAndStudentId(assignmentId, studentId)).thenReturn(false);
        when(submissionRepository.save(any())).thenReturn(saved);

        AssignmentSubmission result = assignmentService.submit(assignmentId, currentUser, req);

        assertThat(result.getStatus()).isEqualTo("SUBMITTED");
        assertThat(result.getStudentId()).isEqualTo(studentId);
    }

    @Test
    void submit_studentNotFound_throwsIllegalArgument() {
        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.of(savedAssignment));
        when(studentRepository.findByUserId(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> assignmentService.submit(assignmentId, currentUser, new SubmissionRequest()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Student profile not found");
    }

    @Test
    void submit_duplicateSubmission_throwsIllegalState() {
        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.of(savedAssignment));
        when(studentRepository.findByUserId(userId)).thenReturn(Optional.of(student));
        when(submissionRepository.existsByAssignmentIdAndStudentId(assignmentId, studentId)).thenReturn(true);

        assertThatThrownBy(() -> assignmentService.submit(assignmentId, currentUser, new SubmissionRequest()))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("already submitted");
    }

    // ── grade ─────────────────────────────────────────────────────────────────

    @Test
    void grade_validRequest_updatesSubmission() {
        UUID submissionId = UUID.randomUUID();
        GradeRequest req = new GradeRequest();
        req.setMarks(85);
        req.setFeedback("Well done");

        AssignmentSubmission submission = AssignmentSubmission.builder()
                .id(submissionId)
                .assignmentId(assignmentId)
                .studentId(studentId)
                .status("SUBMITTED")
                .build();

        when(submissionRepository.findById(submissionId)).thenReturn(Optional.of(submission));
        when(submissionRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        AssignmentSubmission result = assignmentService.grade(submissionId, req);

        assertThat(result.getMarks()).isEqualTo(85);
        assertThat(result.getFeedback()).isEqualTo("Well done");
        assertThat(result.getStatus()).isEqualTo("GRADED");
    }

    @Test
    void grade_submissionNotFound_throwsIllegalArgument() {
        when(submissionRepository.findById(any())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> assignmentService.grade(UUID.randomUUID(), new GradeRequest()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Submission not found");
    }
}
