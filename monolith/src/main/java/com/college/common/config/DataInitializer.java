package com.college.common.config;

import com.college.attendance.model.StudentAttendance;
import com.college.attendance.repository.StudentAttendanceRepository;
import com.college.auth.model.User;
import com.college.auth.repository.UserRepository;
import com.college.employee.model.Employee;
import com.college.employee.repository.EmployeeRepository;
import com.college.lms.model.Announcement;
import com.college.lms.model.Course;
import com.college.lms.repository.AnnouncementRepository;
import com.college.lms.repository.CourseRepository;
import com.college.student.model.Department;
import com.college.student.model.Enrollment;
import com.college.student.model.Student;
import com.college.student.repository.DepartmentRepository;
import com.college.student.repository.EnrollmentRepository;
import com.college.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final StudentRepository studentRepository;
    private final EmployeeRepository employeeRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AnnouncementRepository announcementRepository;
    private final StudentAttendanceRepository studentAttendanceRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String DEFAULT_PASSWORD = "Demo@123";

    @Override
    public void run(ApplicationArguments args) {

        // ── Seed users / departments / employees / students (only on first run) ──────
        if (userRepository.count() == 0) {
            seedCoreData();
        } else {
            log.info("[DataInitializer] Core data already seeded — skipping user/student seed");
        }

        // ── Seed LMS data independently (safe to run on existing DBs) ───────────────
        if (courseRepository.count() == 0) {
            seedLmsData();
        } else {
            log.info("[DataInitializer] LMS data already seeded — skipping courses/announcements");
        }
    }

    private void seedCoreData() {
        log.info("[DataInitializer] Seeding core demo data...");

        // Departments
        Department csDept = departmentRepository.save(Department.builder()
                .name("Computer Science & Engineering").code("CSE")
                .description("Department of Computer Science and Engineering").build());
        Department ecDept = departmentRepository.save(Department.builder()
                .name("Electronics & Communication").code("ECE")
                .description("Department of Electronics and Communication Engineering").build());
        Department mbaDept = departmentRepository.save(Department.builder()
                .name("Business Administration").code("MBA")
                .description("Department of Business Administration").build());

        // Unified demo account
        createUser("Demo User", "demo@college.com", "9000000000", User.Role.ADMIN);

        // Per-role demo accounts
        User admin   = createUser("Admin User",       "admin@demo.com",  "9000000001", User.Role.ADMIN);
        User student = createUser("Arjun Kumar",      "student@demo.com","9000000002", User.Role.STUDENT);
        User staff   = createUser("Dr. Priya Sharma", "staff@demo.com",  "9000000003", User.Role.FACULTY);
        User parent  = createUser("Parent User",      "parent@demo.com", "9000000004", User.Role.PARENT);
        User alumni  = createUser("Alumni User",      "alumni@demo.com", "9000000005", User.Role.ALUMNI);

        // Additional college users
        User faculty2 = createUser("Prof. Rajan Kumar", "rajan.kumar@college.edu", "9000000006", User.Role.FACULTY);
        User student2 = createUser("Meena Devi",        "meena.devi@college.edu",  "9000000007", User.Role.STUDENT);
        User student3 = createUser("Vikram Singh",      "vikram.singh@college.edu","9000000008", User.Role.STUDENT);
        User staff2   = createUser("Ramesh Babu",       "ramesh.babu@college.edu", "9000000009", User.Role.STAFF);

        // Employees
        employeeRepository.save(Employee.builder()
                .userId(staff.getId()).empCode("FAC001").name(staff.getName())
                .email(staff.getEmail()).phone(staff.getPhone())
                .departmentId(csDept.getId()).designation("Associate Professor")
                .employeeType("FACULTY").joinDate(LocalDate.of(2018, 7, 1))
                .baseSalary(new BigDecimal("85000")).status("ACTIVE")
                .qualifications("PhD in Computer Science, IIT Madras").build());

        employeeRepository.save(Employee.builder()
                .userId(faculty2.getId()).empCode("FAC002").name(faculty2.getName())
                .email(faculty2.getEmail()).phone(faculty2.getPhone())
                .departmentId(ecDept.getId()).designation("Professor")
                .employeeType("FACULTY").joinDate(LocalDate.of(2015, 6, 1))
                .baseSalary(new BigDecimal("110000")).status("ACTIVE")
                .qualifications("PhD in Electronics, Anna University").build());

        employeeRepository.save(Employee.builder()
                .userId(staff2.getId()).empCode("STF001").name(staff2.getName())
                .email(staff2.getEmail()).phone(staff2.getPhone())
                .departmentId(mbaDept.getId()).designation("Admin Staff")
                .employeeType("STAFF").joinDate(LocalDate.of(2020, 1, 15))
                .baseSalary(new BigDecimal("35000")).status("ACTIVE").build());

        // Students
        Student arjun = studentRepository.save(Student.builder()
                .id(UUID.randomUUID()).userId(student.getId())
                .rollNumber("CSE2022001").department(csDept)
                .semester(6).batch("2022-26").joinDate(LocalDate.of(2022, 8, 1))
                .status("ACTIVE").guardianName("Mr. Kumar").guardianPhone("9111111111")
                .address("12, Gandhi Street, Chennai - 600001").build());

        studentRepository.save(Student.builder()
                .id(UUID.randomUUID()).userId(student2.getId())
                .rollNumber("CSE2022002").department(csDept)
                .semester(5).batch("2022-26").joinDate(LocalDate.of(2022, 8, 1))
                .status("ACTIVE").guardianName("Mrs. Lakshmi").guardianPhone("9222222222")
                .address("45, Anna Nagar, Chennai - 600040").build());

        studentRepository.save(Student.builder()
                .id(UUID.randomUUID()).userId(student3.getId())
                .rollNumber("ECE2023001").department(ecDept)
                .semester(3).batch("2023-27").joinDate(LocalDate.of(2023, 8, 1))
                .status("ACTIVE").guardianName("Mr. Harpal Singh").guardianPhone("9333333333")
                .address("78, Adyar, Chennai - 600020").build());

        log.info("[DataInitializer] ✓ Core data seeded");
        log.info("  Demo login → demo@college.com / Demo@123");
    }

    private void seedLmsData() {
        log.info("[DataInitializer] Seeding LMS data (courses, enrollments, announcements, attendance)...");

        // Look up the faculty user by email to use as instructor
        Optional<User> staffOpt = userRepository.findByEmail("staff@demo.com");
        UUID facultyId = staffOpt.map(User::getId).orElse(null);

        // Look up CSE department
        Optional<Department> csDeptOpt = departmentRepository.findByCode("CSE");
        Long csDeptId = csDeptOpt.map(Department::getId).orElse(null);

        // ── Courses ───────────────────────────────────────────────────────────────
        Course cs6001 = courseRepository.save(Course.builder().code("CS6001")
                .name("Data Warehousing & Mining").description("Fundamentals of data warehousing, OLAP, data mining techniques and tools.")
                .departmentId(csDeptId).credits(4).semester(6).facultyId(facultyId).status("ACTIVE").build());

        Course cs6002 = courseRepository.save(Course.builder().code("CS6002")
                .name("Compiler Design").description("Lexical analysis, syntax analysis, semantic analysis, code generation and optimization.")
                .departmentId(csDeptId).credits(4).semester(6).facultyId(facultyId).status("ACTIVE").build());

        Course cs6003 = courseRepository.save(Course.builder().code("CS6003")
                .name("Cloud Computing").description("Cloud architecture, virtualization, AWS/Azure services, serverless and containerization.")
                .departmentId(csDeptId).credits(4).semester(6).facultyId(facultyId).status("ACTIVE").build());

        Course cs6004 = courseRepository.save(Course.builder().code("CS6004")
                .name("Cryptography & Network Security").description("Symmetric/asymmetric encryption, digital signatures, network protocols and security.")
                .departmentId(csDeptId).credits(3).semester(6).facultyId(facultyId).status("ACTIVE").build());

        Course cs6005 = courseRepository.save(Course.builder().code("CS6005")
                .name("Elective I — Big Data Analytics").description("Hadoop, Spark, MapReduce, NoSQL databases and large-scale data processing.")
                .departmentId(csDeptId).credits(3).semester(6).facultyId(facultyId).status("ACTIVE").build());

        Course cs6006 = courseRepository.save(Course.builder().code("CS6006")
                .name("Elective II — DevOps").description("CI/CD pipelines, Docker, Kubernetes, infrastructure as code and monitoring.")
                .departmentId(csDeptId).credits(3).semester(6).facultyId(facultyId).status("ACTIVE").build());

        List<Course> courses = List.of(cs6001, cs6002, cs6003, cs6004, cs6005, cs6006);

        // ── Enrollments for Arjun Kumar (student@demo.com) ────────────────────────
        Optional<Student> arjunOpt = studentRepository.findByRollNumber("CSE2022001");
        if (arjunOpt.isPresent()) {
            UUID arjunId = arjunOpt.get().getId();
            for (Course c : courses) {
                enrollmentRepository.save(Enrollment.builder()
                        .studentId(arjunId).courseId(c.getId()).status("ENROLLED").build());
            }

            // ── Attendance — 20 classes per course over the past 4 weeks ──────────
            // Pattern: mostly PRESENT with a few ABSENT and LATE to give realistic %
            String[][] attendancePattern = {
                // CS6001: 17/20 present (85%)
                {"PRESENT","PRESENT","ABSENT","PRESENT","PRESENT",
                 "PRESENT","LATE","PRESENT","PRESENT","ABSENT",
                 "PRESENT","PRESENT","PRESENT","PRESENT","LATE",
                 "PRESENT","PRESENT","PRESENT","PRESENT","PRESENT"},
                // CS6002: 18/20 present (90%)
                {"PRESENT","PRESENT","PRESENT","ABSENT","PRESENT",
                 "PRESENT","PRESENT","PRESENT","PRESENT","PRESENT",
                 "LATE","PRESENT","PRESENT","PRESENT","PRESENT",
                 "PRESENT","ABSENT","PRESENT","PRESENT","PRESENT"},
                // CS6003: 14/20 present (70%)
                {"PRESENT","ABSENT","PRESENT","ABSENT","PRESENT",
                 "ABSENT","PRESENT","PRESENT","ABSENT","PRESENT",
                 "PRESENT","LATE","PRESENT","ABSENT","PRESENT",
                 "PRESENT","PRESENT","ABSENT","PRESENT","PRESENT"},
                // CS6004: 19/20 present (95%)
                {"PRESENT","PRESENT","PRESENT","PRESENT","PRESENT",
                 "PRESENT","PRESENT","PRESENT","PRESENT","PRESENT",
                 "PRESENT","LATE","PRESENT","PRESENT","PRESENT",
                 "PRESENT","PRESENT","PRESENT","PRESENT","ABSENT"},
                // CS6005: 16/20 present (80%)
                {"PRESENT","PRESENT","ABSENT","PRESENT","PRESENT",
                 "ABSENT","PRESENT","PRESENT","PRESENT","PRESENT",
                 "LATE","PRESENT","PRESENT","ABSENT","PRESENT",
                 "PRESENT","PRESENT","ABSENT","PRESENT","PRESENT"},
                // CS6006: 15/20 present (75%)
                {"PRESENT","ABSENT","PRESENT","PRESENT","ABSENT",
                 "PRESENT","PRESENT","ABSENT","PRESENT","PRESENT",
                 "PRESENT","LATE","ABSENT","PRESENT","PRESENT",
                 "PRESENT","ABSENT","PRESENT","PRESENT","PRESENT"},
            };

            LocalDate baseDate = LocalDate.now().minusDays(28);
            for (int ci = 0; ci < courses.size(); ci++) {
                UUID courseId = courses.get(ci).getId();
                String[] pattern = attendancePattern[ci];
                int classDay = 0;
                for (int dayOffset = 0; dayOffset < 30 && classDay < 20; dayOffset++) {
                    LocalDate date = baseDate.plusDays(dayOffset);
                    // Skip weekends
                    if (date.getDayOfWeek().getValue() >= 6) continue;
                    studentAttendanceRepository.save(StudentAttendance.builder()
                            .studentId(arjunId).courseId(courseId)
                            .date(date).status(pattern[classDay])
                            .markedBy(facultyId).build());
                    classDay++;
                }
            }
        }

        // ── Announcements ─────────────────────────────────────────────────────────
        announcementRepository.save(Announcement.builder()
                .courseId(cs6001.getId())
                .title("Unit 4 — New Syllabus Portion Added")
                .content("Unit 3 portion has been completed. Unit 4 starts from next Monday. " +
                         "Please refer textbook chapters 8–10 before attending class.")
                .postedBy(facultyId).build());

        announcementRepository.save(Announcement.builder()
                .courseId(cs6002.getId())
                .title("Assignment 2 Deadline Extended")
                .content("Deadline for Assignment 2 (LL(1) Parser Construction) has been extended to " +
                         "next Friday. Please submit via the digital assignment portal only.")
                .postedBy(facultyId).build());

        announcementRepository.save(Announcement.builder()
                .courseId(cs6003.getId())
                .title("Quiz on Cloud Fundamentals — Next Week")
                .content("There will be an online quiz covering Units 2 & 3 next Tuesday. " +
                         "Syllabus has been uploaded to the course page. Duration: 30 minutes.")
                .postedBy(facultyId).build());

        announcementRepository.save(Announcement.builder()
                .courseId(null) // global announcement
                .title("End Semester Examinations — Schedule Released")
                .content("End Semester Examination schedule for Semester 6 has been released. " +
                         "Please check the Examinations section for your course-wise exam dates and hall details.")
                .postedBy(facultyId).build());

        log.info("[DataInitializer] ✓ LMS data seeded — courses: 6, announcements: 4, attendance records: 120");
    }

    private User createUser(String name, String email, String phone, User.Role role) {
        return userRepository.save(User.builder()
                .name(name).email(email).phone(phone)
                .password(passwordEncoder.encode(DEFAULT_PASSWORD))
                .role(role).active(true).build());
    }
}
