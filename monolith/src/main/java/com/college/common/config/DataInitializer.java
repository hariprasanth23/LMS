package com.college.common.config;

import com.college.attendance.model.StudentAttendance;
import com.college.attendance.repository.StudentAttendanceRepository;
import com.college.auth.model.User;
import com.college.auth.repository.UserRepository;
import com.college.employee.model.Employee;
import com.college.employee.repository.EmployeeRepository;
import com.college.examination.model.ExamSchedule;
import com.college.examination.model.InternalMark;
import com.college.examination.model.SemesterGrade;
import com.college.examination.repository.ExamScheduleRepository;
import com.college.examination.repository.InternalMarkRepository;
import com.college.examination.repository.SemesterGradeRepository;
import com.college.finance.model.FeeRecord;
import com.college.finance.model.PaymentReceipt;
import com.college.finance.model.WalletTransaction;
import com.college.finance.repository.FeeRecordRepository;
import com.college.finance.repository.PaymentReceiptRepository;
import com.college.finance.repository.WalletTransactionRepository;
import com.college.notification.model.Notification;
import com.college.notification.repository.NotificationRepository;
import com.college.research.model.ResearchProfile;
import com.college.research.repository.ResearchProfileRepository;
import com.college.services.model.BonafideApplication;
import com.college.services.model.LibraryBook;
import com.college.services.repository.BonafideRepository;
import com.college.services.repository.LibraryBookRepository;
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
    private final ExamScheduleRepository examScheduleRepository;
    private final InternalMarkRepository internalMarkRepository;
    private final SemesterGradeRepository semesterGradeRepository;
    private final FeeRecordRepository feeRecordRepository;
    private final PaymentReceiptRepository paymentReceiptRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private final BonafideRepository bonafideRepository;
    private final LibraryBookRepository libraryBookRepository;
    private final ResearchProfileRepository researchProfileRepository;
    private final NotificationRepository notificationRepository;
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

        // ── Seed Examination data ────────────────────────────────────────────────────
        if (examScheduleRepository.count() == 0) {
            seedExaminationData();
        } else {
            log.info("[DataInitializer] Examination data already seeded — skipping");
        }

        // ── Seed Finance data ────────────────────────────────────────────────────────
        if (feeRecordRepository.count() == 0) {
            seedFinanceData();
        } else {
            log.info("[DataInitializer] Finance data already seeded — skipping");
        }

        // ── Seed Services data ───────────────────────────────────────────────────────
        if (libraryBookRepository.count() == 0) {
            seedServicesData();
        } else {
            log.info("[DataInitializer] Services data already seeded — skipping");
        }

        // ── Seed Research data ───────────────────────────────────────────────────────
        if (researchProfileRepository.count() == 0) {
            seedResearchData();
        } else {
            log.info("[DataInitializer] Research data already seeded — skipping");
        }

        // ── Seed Notifications ───────────────────────────────────────────────────────
        if (notificationRepository.count() == 0) {
            seedNotifications();
        } else {
            log.info("[DataInitializer] Notifications already seeded — skipping");
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
        createUser("Admin User",  "admin@demo.com",  "9000000001", User.Role.ADMIN);
        User student = createUser("Arjun Kumar",      "student@demo.com","9000000002", User.Role.STUDENT);
        User staff   = createUser("Dr. Priya Sharma", "staff@demo.com",  "9000000003", User.Role.FACULTY);
        createUser("Parent User", "parent@demo.com", "9000000004", User.Role.PARENT);
        createUser("Alumni User", "alumni@demo.com", "9000000005", User.Role.ALUMNI);

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
        studentRepository.save(Student.builder()
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

    private void seedExaminationData() {
        log.info("[DataInitializer] Seeding examination data...");

        Optional<Student> arjunOpt = studentRepository.findByRollNumber("CSE2022001");
        if (arjunOpt.isEmpty()) {
            log.warn("[DataInitializer] Demo student not found — skipping examination seed");
            return;
        }
        UUID arjunId = arjunOpt.get().getId();
        LocalDate examBase = LocalDate.now().plusDays(5);

        // ── Exam Schedule (Semester 6) ────────────────────────────────────────────
        String[][] scheduleData = {
            {"CS6001","Data Warehousing & Mining","10:00 AM","Hall A - 101","End Semester"},
            {"CS6002","Compiler Design","02:00 PM","Hall B - 203","End Semester"},
            {"CS6003","Cloud Computing","10:00 AM","Hall A - 102","End Semester"},
            {"CS6004","Cryptography & Network Security","02:00 PM","Hall C - 301","End Semester"},
            {"CS6005","Elective I — Big Data Analytics","10:00 AM","Hall B - 204","End Semester"},
            {"CS6006","Elective II — DevOps","02:00 PM","Hall A - 103","End Semester"},
        };
        for (int i = 0; i < scheduleData.length; i++) {
            String[] d = scheduleData[i];
            examScheduleRepository.save(ExamSchedule.builder()
                    .courseCode(d[0]).courseName(d[1])
                    .examDate(examBase.plusDays(i * 2L))
                    .timeSlot(d[2]).venue(d[3]).examType(d[4])
                    .semester(6).batch("2022-26").departmentCode("CSE").build());
        }

        // ── Internal Marks (Semester 6) ───────────────────────────────────────────
        int[][] marks = {
            {18, 17, 19, 43, 5},  // CS6001
            {15, 16, 14, 38, 4},  // CS6002
            {19, 18, 20, 46, 5},  // CS6003
            {16, 15, 17, 40, 4},  // CS6004
            {20, 19, 18, 45, 5},  // CS6005
            {14, 16, 15, 35, 3},  // CS6006
        };
        String[] courseCodes = {"CS6001","CS6002","CS6003","CS6004","CS6005","CS6006"};
        String[] courseNames = {
            "Data Warehousing & Mining","Compiler Design","Cloud Computing",
            "Cryptography & Network Security","Elective I — Big Data Analytics","Elective II — DevOps"
        };
        for (int i = 0; i < marks.length; i++) {
            internalMarkRepository.save(InternalMark.builder()
                    .studentId(arjunId).courseCode(courseCodes[i]).courseName(courseNames[i])
                    .semester(6).ca1(marks[i][0]).ca2(marks[i][1]).ca3(marks[i][2])
                    .modelExam(marks[i][3]).attendanceMark(marks[i][4]).build());
        }

        // ── Semester Grades (past 5 semesters + current) ─────────────────────────
        // Past semesters: 1–5 — realistic grades
        Object[][][] pastGrades = {
            // Sem 1
            {{"CS1001","Programming in C",4,"B+",new BigDecimal("7")},{"MA1001","Engineering Mathematics I",4,"A",new BigDecimal("8")},{"PH1001","Engineering Physics",4,"B",new BigDecimal("6")},{"CS1002","Digital Logic Design",3,"A+",new BigDecimal("9")}},
            // Sem 2
            {{"CS2001","Data Structures",4,"O",new BigDecimal("10")},{"MA2001","Engineering Mathematics II",4,"A+",new BigDecimal("9")},{"CS2002","Object Oriented Programming",4,"A",new BigDecimal("8")},{"EC2001","Electronic Circuits",3,"B+",new BigDecimal("7")}},
            // Sem 3
            {{"CS3001","Design & Analysis of Algorithms",4,"A+",new BigDecimal("9")},{"CS3002","Computer Organization",4,"A",new BigDecimal("8")},{"CS3003","Database Management Systems",4,"O",new BigDecimal("10")},{"MA3001","Probability & Statistics",3,"A",new BigDecimal("8")}},
            // Sem 4
            {{"CS4001","Operating Systems",4,"A+",new BigDecimal("9")},{"CS4002","Computer Networks",4,"A",new BigDecimal("8")},{"CS4003","Software Engineering",3,"O",new BigDecimal("10")},{"CS4004","Microprocessors",3,"F",new BigDecimal("0")}},
            // Sem 5
            {{"CS5001","Machine Learning",4,"O",new BigDecimal("10")},{"CS5002","Web Technologies",4,"A+",new BigDecimal("9")},{"CS5003","Theory of Computation",3,"A",new BigDecimal("8")},{"CS5004","Elective I",3,"A+",new BigDecimal("9")}},
        };
        for (int sem = 0; sem < pastGrades.length; sem++) {
            for (Object[] g : pastGrades[sem]) {
                semesterGradeRepository.save(SemesterGrade.builder()
                        .studentId(arjunId)
                        .courseCode((String) g[0]).courseName((String) g[1])
                        .semester(sem + 1).credits((Integer) g[2])
                        .grade((String) g[3]).gradePoints((BigDecimal) g[4]).build());
            }
        }

        // Current semester grades
        String[][] sem6Grades = {
            {"CS6001","Data Warehousing & Mining","4","O","10"},
            {"CS6002","Compiler Design","4","A+","9"},
            {"CS6003","Cloud Computing","4","O","10"},
            {"CS6004","Cryptography & Network Security","3","A","8"},
            {"CS6005","Elective I — Big Data Analytics","3","A+","9"},
            {"CS6006","Elective II — DevOps","3","B+","7"},
        };
        for (String[] g : sem6Grades) {
            semesterGradeRepository.save(SemesterGrade.builder()
                    .studentId(arjunId).courseCode(g[0]).courseName(g[1])
                    .semester(6).credits(Integer.parseInt(g[2]))
                    .grade(g[3]).gradePoints(new BigDecimal(g[4])).build());
        }

        log.info("[DataInitializer] ✓ Examination data seeded — schedule: 6, marks: 6, grades: 26");
    }

    private void seedNotifications() {
        log.info("[DataInitializer] Seeding notifications...");
        userRepository.findByEmail("student@demo.com").ifPresent(u -> {
            Object[][] notifs = {
                {"Assignment Due Tomorrow", "Data Warehousing & Mining assignment due in 24 hours. Please submit via LMS.", "ASSIGNMENT"},
                {"Exam Schedule Released", "End Semester Examination schedule for Semester 6 has been published.", "EXAM"},
                {"Fee Payment Reminder", "Tuition fee of ₹45,000 is due by 1st Jul 2025. Pay to avoid penalty.", "PAYMENT"},
                {"Attendance Warning", "Your attendance in Cloud Computing is below 75%. Attend classes to avoid debarment.", "ALERT"},
                {"Quiz Result Available", "Your DBMS Chapter 5 Quiz result is now available. Score: 9/10.", "INFO"},
            };
            for (Object[] n : notifs) {
                notificationRepository.save(Notification.builder()
                        .userId(u.getId()).title((String) n[0])
                        .message((String) n[1]).type((String) n[2])
                        .isRead(false).build());
            }
        });
        userRepository.findByEmail("staff@demo.com").ifPresent(u -> {
            Object[][] notifs = {
                {"Marks Entry Pending", "Please enter CAT-2 marks for CS6001 — Data Warehousing before Friday.", "ASSIGNMENT"},
                {"Leave Request Approved", "Your leave request for 10 Jun 2025 has been approved by the HoD.", "INFO"},
                {"Faculty Meeting Reminder", "Academic Council meeting scheduled on 12 Jun 2025 at 11 AM.", "EVENT"},
            };
            for (Object[] n : notifs) {
                notificationRepository.save(Notification.builder()
                        .userId(u.getId()).title((String) n[0])
                        .message((String) n[1]).type((String) n[2])
                        .isRead(false).build());
            }
        });
        log.info("[DataInitializer] ✓ Notifications seeded");
    }

    private void seedResearchData() {
        log.info("[DataInitializer] Seeding research data...");
        studentRepository.findByRollNumber("CSE2022001").ifPresent(arjun ->
            researchProfileRepository.save(ResearchProfile.builder()
                    .studentId(arjun.getId())
                    .scholarId("RSC2022001")
                    .programme("Ph.D")
                    .areaOfResearch("Machine Learning & NLP")
                    .registrationDate(LocalDate.of(2022, 1, 15))
                    .guideName("Dr. A. Rajesh")
                    .coGuideName("Dr. S. Meena")
                    .status("Active")
                    .publications(3)
                    .conferences(2)
                    .patents(0)
                    .courseWorkCredits(12)
                    .totalRequiredCredits(20)
                    .build())
        );
        log.info("[DataInitializer] ✓ Research data seeded");
    }

    private void seedServicesData() {
        log.info("[DataInitializer] Seeding services data...");
        Optional<Student> arjunOpt = studentRepository.findByRollNumber("CSE2022001");
        if (arjunOpt.isEmpty()) return;
        UUID arjunId = arjunOpt.get().getId();

        // Bonafide applications
        bonafideRepository.save(BonafideApplication.builder()
                .studentId(arjunId).applicationNumber("BON2024001")
                .purpose("Higher Studies").addressedTo("The Visa Officer")
                .description("Required for university application").language("English")
                .copies(2).urgency("Normal").status("Ready for Collection").build());
        bonafideRepository.save(BonafideApplication.builder()
                .studentId(arjunId).applicationNumber("BON2024002")
                .purpose("Bank Account").addressedTo("The Branch Manager")
                .description("Account opening").language("English")
                .copies(1).urgency("Normal").status("Processing").build());

        // Issued library books
        LocalDate today = LocalDate.now();
        libraryBookRepository.save(LibraryBook.builder()
                .studentId(arjunId).title("Introduction to Algorithms")
                .author("CLRS").isbn("978-0262046305")
                .issueDate(today.minusDays(10)).dueDate(today.plusDays(11))
                .renewalsUsed(0).maxRenewals(2).returned(false).build());
        libraryBookRepository.save(LibraryBook.builder()
                .studentId(arjunId).title("Clean Code")
                .author("Robert C. Martin").isbn("978-0132350884")
                .issueDate(today.minusDays(5)).dueDate(today.plusDays(16))
                .renewalsUsed(1).maxRenewals(2).returned(false).build());
        libraryBookRepository.save(LibraryBook.builder()
                .studentId(arjunId).title("Deep Learning")
                .author("Goodfellow et al.").isbn("978-0262035613")
                .issueDate(today.minusDays(25)).dueDate(today.minusDays(4))
                .renewalsUsed(2).maxRenewals(2).returned(false).build());

        log.info("[DataInitializer] ✓ Services data seeded");
    }

    private void seedFinanceData() {
        log.info("[DataInitializer] Seeding finance data...");

        Optional<Student> arjunOpt = studentRepository.findByRollNumber("CSE2022001");
        if (arjunOpt.isEmpty()) return;
        UUID arjunId = arjunOpt.get().getId();
        LocalDate dueDate = LocalDate.now().plusMonths(1).withDayOfMonth(1);

        // ── Fee records ───────────────────────────────────────────────────────────
        String[][] fees = {
            {"Tuition Fee",                   "45000", "PENDING"},
            {"Hostel Fee",                    "15000", "PAID"},
            {"Library Fee",                   "500",   "PAID"},
            {"Lab Fee",                       "2000",  "PENDING"},
            {"Exam Fee",                      "500",   "PAID"},
            {"University Development Fund",   "5000",  "PENDING"},
        };
        for (String[] f : fees) {
            feeRecordRepository.save(FeeRecord.builder()
                    .studentId(arjunId).feeType(f[0])
                    .amount(new BigDecimal(f[1]))
                    .dueDate(dueDate).status(f[2])
                    .academicYear("2024-25").semester(6).build());
        }

        // ── Payment receipts ──────────────────────────────────────────────────────
        Object[][] receipts = {
            {"RCP001", "Tuition Fee - Sem 5",   45000, "UPI"},
            {"RCP002", "Hostel Fee - Sem 5",    15000, "Net Banking"},
            {"RCP003", "Exam Fee - Sem 4",      500,   "Card"},
            {"RCP004", "Lab Fee - Sem 4",       2000,  "UPI"},
            {"RCP005", "Library Fee",           500,   "Wallet"},
            {"RCP006", "Tuition Fee - Sem 4",   45000, "Net Banking"},
        };
        for (Object[] r : receipts) {
            paymentReceiptRepository.save(PaymentReceipt.builder()
                    .studentId(arjunId).receiptNumber((String) r[0])
                    .description((String) r[1])
                    .amount(new BigDecimal((int) r[2]))
                    .paymentMode((String) r[3]).status("Success").build());
        }

        // ── Wallet with initial balance ───────────────────────────────────────────
        walletTransactionRepository.save(WalletTransaction.builder()
                .studentId(arjunId).type("Credit")
                .amount(new BigDecimal("2340"))
                .mode("Net Banking").balanceAfter(new BigDecimal("2340")).build());

        log.info("[DataInitializer] ✓ Finance data seeded");
    }

    private User createUser(String name, String email, String phone, User.Role role) {
        return userRepository.save(User.builder()
                .name(name).email(email).phone(phone)
                .password(passwordEncoder.encode(DEFAULT_PASSWORD))
                .role(role).active(true).build());
    }
}
