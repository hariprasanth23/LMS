package com.college.academics.service;

import com.college.academics.model.CourseWishlist;
import com.college.academics.model.ProjectApplication;
import com.college.academics.repository.CourseWishlistRepository;
import com.college.academics.repository.ProjectApplicationRepository;
import com.college.auth.model.User;
import com.college.student.model.Student;
import com.college.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AcademicsService {

    private final CourseWishlistRepository wishlistRepo;
    private final ProjectApplicationRepository projectAppRepo;
    private final StudentRepository studentRepo;

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

    // ── Open Projects ─────────────────────────────────────────────────────────────

    public List<Map<String, Object>> getOpenProjects(User user) {
        Student s = getStudentOrThrow(user);
        Set<Long> appliedIds = new HashSet<>();
        projectAppRepo.findByStudentIdOrderByAppliedAtDesc(s.getId())
                .forEach(a -> appliedIds.add(a.getProjectRefId()));

        List<Map<String, Object>> projects = new ArrayList<>();
        for (Object[] row : OPEN_PROJECTS) {
            Map<String, Object> p = new LinkedHashMap<>();
            p.put("id", row[0]);
            p.put("title", row[1]);
            p.put("faculty", row[2]);
            p.put("dept", row[3]);
            p.put("domains", row[4]);
            p.put("description", row[5]);
            p.put("slots", row[6]);
            p.put("totalSlots", row[7]);
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

    private String str(Map<String, Object> map, String key) {
        Object v = map.get(key);
        return v != null ? v.toString() : null;
    }

    // Static open project catalog (in a real system this would be in DB)
    private static final Object[][] OPEN_PROJECTS = {
        {1L, "Smart Campus Energy Monitoring using IoT & ML", "Dr. S. Priya", "CSE Department", new String[]{"Machine Learning","IoT"}, "Develop an IoT-based real-time energy monitoring dashboard. Use ML models to predict peak usage and suggest optimization strategies.", 2, 3},
        {2L, "Federated Learning Framework for Healthcare Privacy", "Dr. A. Meenakshi", "CSE Department", new String[]{"Machine Learning","Cyber Security"}, "Implement a federated learning architecture that enables hospitals to collaboratively train AI models without sharing patient data.", 1, 3},
        {3L, "Blockchain-based Academic Certificate Verification System", "Mr. K. Vignesh", "CSE Department", new String[]{"Blockchain","Web Development"}, "Build a decentralized application on Ethereum to issue and verify academic certificates independently.", 3, 4},
        {4L, "Real-time Sign Language Recognition using Computer Vision", "Dr. R. Sundaramurthy", "CSE Department", new String[]{"Computer Vision","Machine Learning"}, "Develop a deep learning pipeline using MediaPipe and CNN to recognize Indian Sign Language gestures in real-time.", 0, 2},
        {5L, "Multi-tenant SaaS Platform for College Administration", "Ms. R. Divya", "CSE Department", new String[]{"Web Development","Cloud Computing"}, "Design and develop a scalable multi-tenant SaaS platform for college administration including student records, fee management, and faculty portals.", 2, 3},
        {6L, "Automated Code Review Tool using LLMs", "Mr. T. Arun Kumar", "CSE Department", new String[]{"NLP","DevOps"}, "Integrate a fine-tuned LLM into a CI/CD pipeline to automatically review pull requests for bugs, code quality, and security vulnerabilities.", 1, 3},
    };
}
