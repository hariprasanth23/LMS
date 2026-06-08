package com.college.academics.service;

import com.college.academics.model.*;
import com.college.academics.repository.*;
import com.college.auth.model.User;
import com.college.lms.model.Course;
import com.college.lms.repository.CourseRepository;
import com.college.student.model.Enrollment;
import com.college.student.model.Student;
import com.college.student.repository.EnrollmentRepository;
import com.college.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AcademicsService {

    private final CourseWishlistRepository wishlistRepo;
    private final ProjectApplicationRepository projectAppRepo;
    private final EXCRegistrationRepository excRepo;
    private final MOOCSubmissionRepository moocRepo;
    private final InternshipRegistrationRepository internshipRepo;
    private final ConferenceRegistrationRepository conferenceRepo;
    private final StudentRepository studentRepo;
    private final CourseRepository courseRepo;
    private final EnrollmentRepository enrollmentRepo;

    private Student getStudentOrThrow(User user) {
        return studentRepo.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException("Student profile not found"));
    }

    // ── Wishlist ──────────────────────────────────────────────────────────────────

    public List<CourseWishlist> getWishlist(User user) {
        Student s = getStudentOrThrow(user);
        return wishlistRepo.findByStudentIdOrderByAddedAtDesc(s.getId());
    }

    public CourseWishlist addToWishlist(User user, Map<String, Object> body) {
        Student s = getStudentOrThrow(user);
        String code = body.getOrDefault("courseCode", "").toString();
        if (wishlistRepo.existsByStudentIdAndCourseCode(s.getId(), code))
            throw new IllegalStateException("Course already in wishlist");
        return wishlistRepo.save(CourseWishlist.builder()
                .studentId(s.getId())
                .courseCode(code)
                .courseName(str(body, "courseName"))
                .faculty(str(body, "faculty"))
                .credits(body.get("credits") != null ? Integer.parseInt(body.get("credits").toString()) : null)
                .slot(str(body, "slot"))
                .seatsAvailable(body.get("seatsAvailable") != null ? Integer.parseInt(body.get("seatsAvailable").toString()) : null)
                .totalSeats(body.get("totalSeats") != null ? Integer.parseInt(body.get("totalSeats").toString()) : null)
                .build());
    }

    @Transactional
    public void removeFromWishlist(User user, String courseCode) {
        Student s = getStudentOrThrow(user);
        wishlistRepo.deleteByStudentIdAndCourseCode(s.getId(), courseCode);
    }

    // ── Registered courses (from enrollment + LMS) ────────────────────────────────

    public List<Map<String, Object>> getRegisteredCourses(User user) {
        Student s = getStudentOrThrow(user);
        List<Enrollment> enrollments = enrollmentRepo.findByStudentId(s.getId());
        List<Map<String, Object>> result = new ArrayList<>();
        for (Enrollment e : enrollments) {
            courseRepo.findById(e.getCourseId()).ifPresent(c -> {
                Map<String, Object> entry = new LinkedHashMap<>();
                entry.put("code", c.getCode());
                entry.put("name", c.getName());
                entry.put("credits", c.getCredits());
                entry.put("faculty", "Faculty");
                entry.put("status", e.getStatus());
                entry.put("eligible", true);
                result.add(entry);
            });
        }
        return result;
    }

    // ── EXC courses ───────────────────────────────────────────────────────────────

    public List<Map<String, Object>> getAvailableEXCCourses() {
        return List.of(
            excCourse("EXC001", "Design Thinking & Innovation",      "Dr. M. Suresh",  2, 8),
            excCourse("EXC002", "Entrepreneurship Development",      "Ms. L. Kaveri",  2, 5),
            excCourse("EXC003", "Universal Human Values",            "Dr. P. Anand",   2, 12),
            excCourse("EXC004", "Environmental Science & Awareness", "Mr. R. Balaji",  2, 3)
        );
    }

    public EXCRegistration registerEXC(User user, String courseCode, String courseName, String faculty, Integer credits) {
        Student s = getStudentOrThrow(user);
        if (excRepo.existsByStudentIdAndCourseCode(s.getId(), courseCode))
            throw new IllegalStateException("Already registered for this EXC course");
        return excRepo.save(EXCRegistration.builder()
                .studentId(s.getId())
                .courseCode(courseCode).courseName(courseName)
                .faculty(faculty).credits(credits)
                .semester(s.getSemester()).status("Approved").build());
    }

    public List<EXCRegistration> getMyEXCRegistrations(User user) {
        Student s = getStudentOrThrow(user);
        return excRepo.findByStudentIdOrderByRegisteredAtDesc(s.getId());
    }

    // ── MOOC ─────────────────────────────────────────────────────────────────────

    public MOOCSubmission submitMOOC(User user, Map<String, Object> body) {
        Student s = getStudentOrThrow(user);
        String completionDateStr = str(body, "completionDate");
        return moocRepo.save(MOOCSubmission.builder()
                .studentId(s.getId())
                .platform(str(body, "platform"))
                .courseName(str(body, "courseName"))
                .durationWeeks(body.get("durationWeeks") != null ? Integer.parseInt(body.get("durationWeeks").toString()) : null)
                .completionDate(completionDateStr != null ? LocalDate.parse(completionDateStr) : null)
                .status("Pending").build());
    }

    public List<MOOCSubmission> getMyMOOCs(User user) {
        Student s = getStudentOrThrow(user);
        return moocRepo.findByStudentIdOrderBySubmittedAtDesc(s.getId());
    }

    // ── Internship ────────────────────────────────────────────────────────────────

    public InternshipRegistration submitInternship(User user, Map<String, Object> body) {
        Student s = getStudentOrThrow(user);
        return internshipRepo.save(InternshipRegistration.builder()
                .studentId(s.getId())
                .companyName(str(body, "companyName"))
                .role(str(body, "role"))
                .startDate(body.get("startDate") != null ? LocalDate.parse(body.get("startDate").toString()) : null)
                .endDate(body.get("endDate") != null ? LocalDate.parse(body.get("endDate").toString()) : null)
                .durationWeeks(body.get("durationWeeks") != null ? Integer.parseInt(body.get("durationWeeks").toString()) : null)
                .stipend(str(body, "stipend"))
                .mentorName(str(body, "mentorName"))
                .mentorEmail(str(body, "mentorEmail"))
                .status("Ongoing").build());
    }

    public List<InternshipRegistration> getMyInternships(User user) {
        Student s = getStudentOrThrow(user);
        return internshipRepo.findByStudentIdOrderByRegisteredAtDesc(s.getId());
    }

    // ── Conference / SET ──────────────────────────────────────────────────────────

    public ConferenceRegistration registerConference(User user, Map<String, Object> body) {
        Student s = getStudentOrThrow(user);
        return conferenceRepo.save(ConferenceRegistration.builder()
                .studentId(s.getId())
                .conferenceName(str(body, "conferenceName"))
                .venue(str(body, "venue"))
                .conferenceDate(body.get("conferenceDate") != null ? LocalDate.parse(body.get("conferenceDate").toString()) : null)
                .submissionDeadline(body.get("submissionDeadline") != null ? LocalDate.parse(body.get("submissionDeadline").toString()) : null)
                .paperTitle(str(body, "paperTitle"))
                .coAuthors(str(body, "coAuthors"))
                .status("Registered").build());
    }

    public List<ConferenceRegistration> getMyConferences(User user) {
        Student s = getStudentOrThrow(user);
        return conferenceRepo.findByStudentIdOrderByRegisteredAtDesc(s.getId());
    }

    // ── Open Projects ─────────────────────────────────────────────────────────────

    public List<Map<String, Object>> getOpenProjects(User user) {
        Student s = getStudentOrThrow(user);
        Set<Long> appliedIds = new HashSet<>();
        projectAppRepo.findByStudentIdOrderByAppliedAtDesc(s.getId())
                .forEach(a -> appliedIds.add(a.getProjectRefId()));
        List<Map<String, Object>> projects = new ArrayList<>();
        for (Object[] row : OPEN_PROJECTS) {
            Map<String, Object> p = new LinkedHashMap<>();
            p.put("id", row[0]); p.put("title", row[1]); p.put("faculty", row[2]);
            p.put("dept", row[3]); p.put("domains", row[4]); p.put("description", row[5]);
            p.put("slots", row[6]); p.put("totalSlots", row[7]);
            p.put("applied", appliedIds.contains(((Number) row[0]).longValue()));
            projects.add(p);
        }
        return projects;
    }

    public ProjectApplication applyForProject(User user, Long projectRefId, String title, String faculty) {
        Student s = getStudentOrThrow(user);
        if (projectAppRepo.existsByStudentIdAndProjectRefId(s.getId(), projectRefId))
            throw new IllegalStateException("Already applied");
        return projectAppRepo.save(ProjectApplication.builder()
                .studentId(s.getId()).projectRefId(projectRefId)
                .projectTitle(title).facultyName(faculty).status("Under Review").build());
    }

    public List<ProjectApplication> getMyProjectApplications(User user) {
        Student s = getStudentOrThrow(user);
        return projectAppRepo.findByStudentIdOrderByAppliedAtDesc(s.getId());
    }

    // ── Registration schedule (static) ────────────────────────────────────────────

    public List<Map<String, Object>> getRegistrationSchedule() {
        LocalDate today = LocalDate.now();
        return List.of(
            schedulePhase("Phase 1 Registration",       today.minusDays(60), today.minusDays(51), "Completed", "Initial course registration"),
            schedulePhase("Withdrawal Window",           today.minusDays(5),  today.plusDays(4),  "Active",    "Drop courses without academic penalty"),
            schedulePhase("EXC / MOOC Registration",    today.minusDays(1),  today.plusDays(9),  "Active",    "Extra credit & MOOC submissions"),
            schedulePhase("Phase 2 Registration",       today.plusDays(7),   today.plusDays(13), "Upcoming",  "Add courses for next semester"),
            schedulePhase("Final Confirmation",         today.plusDays(17),  today.plusDays(20), "Upcoming",  "Freeze and confirm all registrations")
        );
    }

    // ── Helpers ───────────────────────────────────────────────────────────────────

    private String str(Map<String, Object> map, String key) {
        Object v = map.get(key);
        return v != null ? v.toString() : null;
    }

    private Map<String, Object> excCourse(String code, String name, String faculty, int credits, int slots) {
        return Map.of("code", code, "name", name, "faculty", faculty, "credits", credits, "slots", slots);
    }

    private Map<String, Object> schedulePhase(String phase, LocalDate start, LocalDate end, String status, String note) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("phase", phase); m.put("start", start.toString()); m.put("end", end.toString());
        m.put("status", status); m.put("note", note);
        return m;
    }

    private static final Object[][] OPEN_PROJECTS = {
        {1L, "Smart Campus Energy Monitoring using IoT & ML", "Dr. S. Priya", "CSE Department", new String[]{"Machine Learning","IoT"}, "Develop an IoT-based real-time energy monitoring dashboard. Use ML models to predict peak usage.", 2, 3},
        {2L, "Federated Learning Framework for Healthcare Privacy", "Dr. A. Meenakshi", "CSE Department", new String[]{"Machine Learning","Cyber Security"}, "Implement a federated learning architecture for hospitals to collaboratively train AI models without sharing patient data.", 1, 3},
        {3L, "Blockchain-based Academic Certificate Verification", "Mr. K. Vignesh", "CSE Department", new String[]{"Blockchain","Web Development"}, "Build a decentralized application on Ethereum to issue and verify academic certificates independently.", 3, 4},
        {4L, "Real-time Sign Language Recognition using Computer Vision", "Dr. R. Sundaramurthy", "CSE Department", new String[]{"Computer Vision","Machine Learning"}, "Develop a deep learning pipeline using MediaPipe and CNN to recognize Indian Sign Language gestures in real-time.", 0, 2},
        {5L, "Multi-tenant SaaS Platform for College Administration", "Ms. R. Divya", "CSE Department", new String[]{"Web Development","Cloud Computing"}, "Design and develop a scalable multi-tenant SaaS platform for college administration.", 2, 3},
        {6L, "Automated Code Review Tool using LLMs", "Mr. T. Arun Kumar", "CSE Department", new String[]{"NLP","DevOps"}, "Integrate a fine-tuned LLM into a CI/CD pipeline to automatically review pull requests.", 1, 3},
    };
}
