package com.college.research.service;

import com.college.auth.model.User;
import com.college.research.model.ResearchProfile;
import com.college.research.model.WeeklyLog;
import com.college.research.repository.ResearchProfileRepository;
import com.college.research.repository.WeeklyLogRepository;
import com.college.student.model.Student;
import com.college.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ResearchService {

    private final ResearchProfileRepository profileRepo;
    private final WeeklyLogRepository weeklyLogRepo;
    private final StudentRepository studentRepo;

    private Student getStudentOrThrow(User user) {
        return studentRepo.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException("Student profile not found"));
    }

    public Optional<ResearchProfile> getProfile(User user) {
        Student s = getStudentOrThrow(user);
        return profileRepo.findByStudentId(s.getId());
    }

    public List<WeeklyLog> getWeeklyLogs(User user) {
        Student s = getStudentOrThrow(user);
        return weeklyLogRepo.findByStudentIdOrderBySubmittedAtDesc(s.getId());
    }

    public WeeklyLog submitWeeklyLog(User user, Map<String, Object> body) {
        Student s = getStudentOrThrow(user);
        Object rawActivities = body.get("activities");
        String activities = rawActivities instanceof List<?>
                ? String.join(", ", ((List<?>) rawActivities).stream().map(Object::toString).toList())
                : String.valueOf(body.getOrDefault("activities", ""));
        return weeklyLogRepo.save(WeeklyLog.builder()
                .studentId(s.getId())
                .weekLabel(body.getOrDefault("weekLabel", "").toString())
                .activities(activities)
                .hoursSpent(body.get("hoursSpent") != null ? Integer.parseInt(body.get("hoursSpent").toString()) : 0)
                .summary(body.getOrDefault("summary", "").toString())
                .build());
    }
}
