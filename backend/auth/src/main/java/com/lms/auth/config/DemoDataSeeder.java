package com.lms.auth.config;

import com.lms.auth.model.User;
import com.lms.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.UUID;

/**
 * Seeds a fixed set of demo users on first startup, so a freshly cloned
 * repo has something to log in with immediately.
 *
 * <p>UUIDs are <b>deterministic</b> — hard-coded in this file — because the
 * seed SQL in {@code backend/infra/db/seed-demo-data.sql} references them
 * as foreign keys (student.user_id, employee.user_id, etc.). If you change
 * a UUID here, update the SQL too.
 *
 * <p>Enabled by default. Set {@code app.demo-seed.enabled=false} to skip
 * (do this in prod).
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.demo-seed.enabled", havingValue = "true", matchIfMissing = true)
public class DemoDataSeeder {

    // ── Fixed UUIDs — referenced by seed-demo-data.sql ────────────────────
    public static final UUID ADMIN_ID    = UUID.fromString("f1c7debf-fc68-4ba0-ac34-fd3d971922a1");
    public static final UUID FACULTY_1   = UUID.fromString("81c1cedc-e9e1-4354-bab9-ab3ba69c207d");
    public static final UUID FACULTY_2   = UUID.fromString("06d5261c-f007-4697-8790-5f4bc787a8a6");
    public static final UUID FACULTY_3   = UUID.fromString("76b590c2-5301-4cc1-be16-7aa77f2ba7f1");
    public static final UUID FACULTY_4   = UUID.fromString("dba39819-a584-4848-99d6-ead56c6c149e");
    public static final UUID FACULTY_5   = UUID.fromString("c53e0612-a982-4733-91f9-6fc831fafb48");
    public static final UUID STUDENT_1   = UUID.fromString("e2c41c92-16a1-4d6f-ac34-815e1d6340c0");
    public static final UUID STUDENT_2   = UUID.fromString("6cf49094-61e2-4839-8a29-2dca4148a95f");
    public static final UUID STUDENT_3   = UUID.fromString("a96e57f2-dca4-4578-951a-d06595a7021f");
    public static final UUID STUDENT_4   = UUID.fromString("0a51a82c-e620-4c09-81bd-f50e23ccd99d");
    public static final UUID STUDENT_5   = UUID.fromString("8a7d5ef2-84e7-467f-8d39-93c6b04375f5");
    public static final UUID PARENT_1    = UUID.fromString("cf13d520-8f1e-4d2f-a1e0-6b6b9e7f0001");

    private static final String DEFAULT_PW = "Demo@123";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public ApplicationRunner seedDemoUsers() {
        return args -> {
            if (userRepository.count() > 0) {
                log.info("Demo seed skipped — users table is not empty");
                return;
            }
            String hash = passwordEncoder.encode(DEFAULT_PW);
            List<User> demo = List.of(
                buildUser(ADMIN_ID,   "Admin User", "admin@sample.edu",    User.Role.ADMIN,   hash),
                buildUser(FACULTY_1,  "Dr. Faculty 1", "faculty1@sample.edu", User.Role.FACULTY, hash),
                buildUser(FACULTY_2,  "Dr. Faculty 2", "faculty2@sample.edu", User.Role.FACULTY, hash),
                buildUser(FACULTY_3,  "Dr. Faculty 3", "faculty3@sample.edu", User.Role.FACULTY, hash),
                buildUser(FACULTY_4,  "Dr. Faculty 4", "faculty4@sample.edu", User.Role.FACULTY, hash),
                buildUser(FACULTY_5,  "Dr. Faculty 5", "faculty5@sample.edu", User.Role.FACULTY, hash),
                buildUser(STUDENT_1,  "Student 1",     "student1@sample.edu", User.Role.STUDENT, hash),
                buildUser(STUDENT_2,  "Student 2",     "student2@sample.edu", User.Role.STUDENT, hash),
                buildUser(STUDENT_3,  "Student 3",     "student3@sample.edu", User.Role.STUDENT, hash),
                buildUser(STUDENT_4,  "Student 4",     "student4@sample.edu", User.Role.STUDENT, hash),
                buildUser(STUDENT_5,  "Student 5",     "student5@sample.edu", User.Role.STUDENT, hash),
                buildUser(PARENT_1,   "Parent 1",      "parent1@sample.edu",  User.Role.PARENT,  hash)
            );
            userRepository.saveAll(demo);
            log.info("Demo seed created {} users (password: {})", demo.size(), DEFAULT_PW);
        };
    }

    private User buildUser(UUID id, String name, String email, User.Role role, String hash) {
        return User.builder()
                .id(id)
                .name(name)
                .email(email)
                .passwordHash(hash)
                .role(role)
                .active(true)
                .build();
    }
}
