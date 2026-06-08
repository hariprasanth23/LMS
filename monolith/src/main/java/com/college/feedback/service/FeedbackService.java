package com.college.feedback.service;

import com.college.auth.model.User;
import com.college.feedback.dto.CourseFeedbackRequest;
import com.college.feedback.dto.Feedback247Request;
import com.college.feedback.model.CourseFeedback;
import com.college.feedback.model.Feedback247;
import com.college.feedback.repository.CourseFeedbackRepository;
import com.college.feedback.repository.Feedback247Repository;
import com.college.lms.model.Course;
import com.college.lms.repository.CourseRepository;
import com.college.student.model.Student;
import com.college.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final CourseFeedbackRepository courseFeedbackRepo;
    private final Feedback247Repository feedback247Repo;
    private final StudentRepository studentRepo;
    private final CourseRepository courseRepo;

    private Student getStudentOrThrow(User user) {
        return studentRepo.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException("Student profile not found"));
    }

    // ── Course feedback status ────────────────────────────────────────────────────

    public Map<String, Object> getFeedbackStatus(User user) {
        Student student = getStudentOrThrow(user);
        List<Course> courses = courseRepo.findBySemesterAndDepartmentId(
                student.getSemester(), student.getDepartment().getId());

        List<Map<String, Object>> courseList = new ArrayList<>();
        for (Course c : courses) {
            boolean submitted = courseFeedbackRepo.existsByStudentIdAndCourseCodeAndSemester(
                    student.getId(), c.getCode(), student.getSemester());
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("code", c.getCode());
            entry.put("name", c.getName());
            entry.put("faculty", "Faculty");
            entry.put("submitted", submitted);
            courseList.add(entry);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("semester", student.getSemester());
        result.put("courses", courseList);
        return result;
    }

    // ── Submit course feedback ────────────────────────────────────────────────────

    public List<CourseFeedback> submitCourseFeedback(User user, CourseFeedbackRequest req) {
        Student student = getStudentOrThrow(user);
        List<CourseFeedback> saved = new ArrayList<>();
        for (CourseFeedbackRequest.FeedbackItem item : req.getFeedbacks()) {
            if (courseFeedbackRepo.existsByStudentIdAndCourseCodeAndSemester(
                    student.getId(), item.getCourseCode(), student.getSemester())) {
                continue;
            }
            saved.add(courseFeedbackRepo.save(CourseFeedback.builder()
                    .studentId(student.getId())
                    .courseCode(item.getCourseCode())
                    .courseName(item.getCourseName())
                    .facultyName(item.getFacultyName())
                    .semester(student.getSemester())
                    .contentDelivery(item.getContentDelivery())
                    .teachingClarity(item.getTeachingClarity())
                    .studentEngagement(item.getStudentEngagement())
                    .useOfTechnology(item.getUseOfTechnology())
                    .availabilityForDoubts(item.getAvailabilityForDoubts())
                    .comments(item.getComments())
                    .build()));
        }
        return saved;
    }

    // ── 24x7 feedback ─────────────────────────────────────────────────────────────

    public List<Feedback247> getMy247Feedbacks(User user) {
        Student student = getStudentOrThrow(user);
        return feedback247Repo.findByStudentIdOrderBySubmittedAtDesc(student.getId());
    }

    public Feedback247 submit247Feedback(User user, Feedback247Request req) {
        Student student = getStudentOrThrow(user);
        return feedback247Repo.save(Feedback247.builder()
                .studentId(req.getAnonymous() != null && req.getAnonymous() ? null : student.getId())
                .courseCode(req.getCourseCode())
                .courseName(req.getCourseName())
                .feedbackType(req.getFeedbackType())
                .topic(req.getTopic())
                .rating(req.getRating())
                .feedbackText(req.getFeedbackText())
                .anonymous(req.getAnonymous() != null ? req.getAnonymous() : true)
                .status("Received")
                .build());
    }
}
