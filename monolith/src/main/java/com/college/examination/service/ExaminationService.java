package com.college.examination.service;

import com.college.auth.model.User;
import com.college.examination.dto.ArrearRegistrationRequest;
import com.college.examination.dto.MakeupExamRequest;
import com.college.examination.model.*;
import com.college.examination.repository.*;
import com.college.student.model.Student;
import com.college.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ExaminationService {

    private final ExamScheduleRepository examScheduleRepo;
    private final InternalMarkRepository internalMarkRepo;
    private final SemesterGradeRepository semesterGradeRepo;
    private final ArrearRegistrationRepository arrearRepo;
    private final MakeupExamRepository makeupRepo;
    private final StudentRepository studentRepo;

    private Student getStudentOrThrow(User user) {
        return studentRepo.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException("Student profile not found"));
    }

    // ── Exam Schedule ────────────────────────────────────────────────────────────

    public List<ExamSchedule> getExamSchedule(User user) {
        Student student = getStudentOrThrow(user);
        String deptCode = student.getDepartment().getCode();
        return examScheduleRepo.findByDepartmentCodeAndSemesterOrderByExamDate(deptCode, student.getSemester());
    }

    // ── Internal Marks ───────────────────────────────────────────────────────────

    public List<InternalMark> getMarks(User user) {
        Student student = getStudentOrThrow(user);
        return internalMarkRepo.findByStudentIdAndSemesterOrderByCourseCode(student.getId(), student.getSemester());
    }

    // ── Current Semester Grades ──────────────────────────────────────────────────

    public Map<String, Object> getGrades(User user) {
        Student student = getStudentOrThrow(user);
        List<SemesterGrade> grades = semesterGradeRepo.findByStudentIdAndSemesterOrderByCourseCode(
                student.getId(), student.getSemester());

        int totalCredits = grades.stream().mapToInt(g -> g.getCredits() != null ? g.getCredits() : 0).sum();
        double weightedSum = grades.stream()
                .mapToDouble(g -> (g.getCredits() != null ? g.getCredits() : 0)
                        * (g.getGradePoints() != null ? g.getGradePoints().doubleValue() : 0))
                .sum();
        double sgpa = totalCredits > 0 ? weightedSum / totalCredits : 0;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("semester", student.getSemester());
        result.put("grades", grades);
        result.put("totalCredits", totalCredits);
        result.put("sgpa", BigDecimal.valueOf(sgpa).setScale(2, RoundingMode.HALF_UP));
        return result;
    }

    // ── Grade History ────────────────────────────────────────────────────────────

    public Map<String, Object> getGradeHistory(User user) {
        Student student = getStudentOrThrow(user);
        List<Object[]> sgpaRows = semesterGradeRepo.findSgpaByStudentId(student.getId());

        List<Map<String, Object>> semList = new ArrayList<>();
        double cgpaSum = 0;
        int cgpaCount = 0;
        for (Object[] row : sgpaRows) {
            Integer sem = (Integer) row[0];
            double sgpa = row[1] instanceof BigDecimal ? ((BigDecimal) row[1]).doubleValue() : ((Double) row[1]);
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("sem", "Sem " + sem);
            entry.put("sgpa", BigDecimal.valueOf(sgpa).setScale(2, RoundingMode.HALF_UP));
            semList.add(entry);
            cgpaSum += sgpa;
            cgpaCount++;
        }
        double cgpa = cgpaCount > 0 ? cgpaSum / cgpaCount : 0;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("semesters", semList);
        result.put("cgpa", BigDecimal.valueOf(cgpa).setScale(2, RoundingMode.HALF_UP));
        result.put("currentSgpa", semList.isEmpty() ? BigDecimal.ZERO :
                (BigDecimal) semList.get(semList.size() - 1).get("sgpa"));
        return result;
    }

    // ── Arrear Registration ──────────────────────────────────────────────────────

    public List<Map<String, Object>> getEligibleArrearSubjects(User user) {
        Student student = getStudentOrThrow(user);
        // Subjects where grade is F in any past semester
        List<SemesterGrade> allGrades = semesterGradeRepo.findByStudentIdOrderBySemesterDescCourseCode(student.getId());
        List<Map<String, Object>> eligible = new ArrayList<>();
        Set<String> seenCodes = new HashSet<>();
        for (SemesterGrade g : allGrades) {
            if ("F".equals(g.getGrade()) && !seenCodes.contains(g.getCourseCode())) {
                boolean alreadyRegistered = arrearRepo.existsByStudentIdAndCourseCode(student.getId(), g.getCourseCode());
                if (!alreadyRegistered) {
                    Map<String, Object> entry = new LinkedHashMap<>();
                    entry.put("code", g.getCourseCode());
                    entry.put("name", g.getCourseName());
                    entry.put("regulation", "R2021");
                    entry.put("fee", 500);
                    eligible.add(entry);
                    seenCodes.add(g.getCourseCode());
                }
            }
        }
        return eligible;
    }

    public List<ArrearRegistration> getArrearRegistrations(User user) {
        Student student = getStudentOrThrow(user);
        return arrearRepo.findByStudentIdOrderByRegisteredAtDesc(student.getId());
    }

    public List<ArrearRegistration> registerArrear(User user, ArrearRegistrationRequest req) {
        Student student = getStudentOrThrow(user);
        List<ArrearRegistration> saved = new ArrayList<>();
        for (ArrearRegistrationRequest.CourseItem item : req.getCourses()) {
            if (!arrearRepo.existsByStudentIdAndCourseCode(student.getId(), item.getCourseCode())) {
                ArrearRegistration reg = ArrearRegistration.builder()
                        .studentId(student.getId())
                        .courseCode(item.getCourseCode())
                        .courseName(item.getCourseName())
                        .regulation(item.getRegulation() != null ? item.getRegulation() : "R2021")
                        .feeAmount(item.getFeeAmount())
                        .receiptNumber("RCT-" + System.currentTimeMillis())
                        .status("Paid")
                        .build();
                saved.add(arrearRepo.save(reg));
            }
        }
        return saved;
    }

    public List<ExamSchedule> getArrearSchedule(User user) {
        Student student = getStudentOrThrow(user);
        return examScheduleRepo.findBySemesterAndDepartmentCodeOrderByExamDate(0, student.getDepartment().getCode());
    }

    // ── Makeup Exam ───────────────────────────────────────────────────────────────

    public List<MakeupExamApplication> getMakeupApplications(User user) {
        Student student = getStudentOrThrow(user);
        return makeupRepo.findByStudentIdOrderByAppliedAtDesc(student.getId());
    }

    public MakeupExamApplication applyMakeup(User user, MakeupExamRequest req) {
        Student student = getStudentOrThrow(user);
        MakeupExamApplication app = MakeupExamApplication.builder()
                .studentId(student.getId())
                .courseCode(req.getCourseCode())
                .courseName(req.getCourseName())
                .reason(req.getReason())
                .absenceDate(req.getAbsenceDate())
                .detailedReason(req.getDetailedReason())
                .supportingDoc(req.getSupportingDoc())
                .status("Pending")
                .build();
        return makeupRepo.save(app);
    }
}
