package com.college.common.config;

import com.college.auth.model.User;
import com.college.auth.repository.UserRepository;
import com.college.employee.model.Employee;
import com.college.employee.repository.EmployeeRepository;
import com.college.student.model.Department;
import com.college.student.model.Student;
import com.college.student.repository.DepartmentRepository;
import com.college.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final StudentRepository studentRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String DEFAULT_PASSWORD = "Demo@123";

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.count() > 0) {
            log.info("[DataInitializer] Data already seeded — skipping");
            return;
        }

        log.info("[DataInitializer] Seeding demo data...");

        // ── Departments ───────────────────────────────────────────────────────────
        Department csDept = departmentRepository.save(Department.builder()
                .name("Computer Science & Engineering").code("CSE")
                .description("Department of Computer Science and Engineering").build());
        Department ecDept = departmentRepository.save(Department.builder()
                .name("Electronics & Communication").code("ECE")
                .description("Department of Electronics and Communication Engineering").build());
        Department mbaDept = departmentRepository.save(Department.builder()
                .name("Business Administration").code("MBA")
                .description("Department of Business Administration").build());

        // ── Single unified demo account (works with any portal selection) ──────────
        createUser("Demo User", "demo@college.com", "9000000000", User.Role.ADMIN);

        // ── Per-role demo accounts (legacy, kept for backend testing) ─────────────
        User admin   = createUser("Admin User",        "admin@demo.com",   "9000000001", User.Role.ADMIN);
        User student = createUser("Arjun Kumar",       "student@demo.com", "9000000002", User.Role.STUDENT);
        User staff   = createUser("Dr. Priya Sharma",  "staff@demo.com",   "9000000003", User.Role.FACULTY);
        User parent  = createUser("Parent User",       "parent@demo.com",  "9000000004", User.Role.PARENT);
        User alumni  = createUser("Alumni User",       "alumni@demo.com",  "9000000005", User.Role.ALUMNI);

        // ── Additional College Users ──────────────────────────────────────────────
        User faculty2  = createUser("Prof. Rajan Kumar",  "rajan.kumar@college.edu",   "9000000006", User.Role.FACULTY);
        User student2  = createUser("Meena Devi",         "meena.devi@college.edu",    "9000000007", User.Role.STUDENT);
        User student3  = createUser("Vikram Singh",       "vikram.singh@college.edu",  "9000000008", User.Role.STUDENT);
        User staff2    = createUser("Ramesh Babu",        "ramesh.babu@college.edu",   "9000000009", User.Role.STAFF);

        // ── Employees ────────────────────────────────────────────────────────────
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

        // ── Students ─────────────────────────────────────────────────────────────
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

        log.info("[DataInitializer] ✓ Demo data seeded successfully");
        log.info("──────────────────────────────────────────────");
        log.info("  UNIFIED DEMO ACCOUNT (all portals)");
        log.info("  Email    → demo@college.com");
        log.info("  Password → Demo@123");
        log.info("──────────────────────────────────────────────");
    }

    private User createUser(String name, String email, String phone, User.Role role) {
        return userRepository.save(User.builder()
                .name(name).email(email).phone(phone)
                .password(passwordEncoder.encode(DEFAULT_PASSWORD))
                .role(role).active(true).build());
    }
}
