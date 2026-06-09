package com.college.student.controller;

import com.college.auth.model.User;
import com.college.auth.repository.UserRepository;
import com.college.common.dto.ApiResponse;
import com.college.student.dto.StudentImportRow;
import com.college.student.dto.StudentRequest;
import com.college.student.model.Student;
import com.college.student.model.StudentBankInfo;
import com.college.student.repository.StudentBankInfoRepository;
import com.college.student.repository.StudentRepository;
import com.college.student.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;

import java.time.LocalDate;
import java.util.*;
import java.util.ArrayList;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@Slf4j
@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private static final String CHARS =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    private static final SecureRandom RNG = new SecureRandom();

    private String generateInitialPassword() {
        StringBuilder sb = new StringBuilder(12);
        for (int i = 0; i < 12; i++) sb.append(CHARS.charAt(RNG.nextInt(CHARS.length())));
        return sb.toString();
    }

    private final StudentService studentService;
    private final StudentRepository studentRepository;
    private final StudentBankInfoRepository bankInfoRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<ApiResponse<List<Student>>> getAll(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(ApiResponse.ok(
                studentService.findAll(PageRequest.of(page, size, Sort.by("id")))));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Student>> getOwnProfile(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(ApiResponse.ok(studentService.findOwnProfile(currentUser)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<ApiResponse<Student>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(studentService.findById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Student>> create(@Valid @RequestBody StudentRequest request) {
        Student created = studentService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Student created", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Student>> update(@PathVariable UUID id,
                                                       @Valid @RequestBody StudentRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Student updated", studentService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        studentService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Student deleted", null));
    }

    // ── Bulk CSV Import ───────────────────────────────────────────────────────────

    @PostMapping("/import")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> importStudents(
            @Valid @RequestBody List<StudentImportRow> rows) {

        int success = 0, failure = 0;
        List<Map<String, Object>> results = new ArrayList<>();

        for (int i = 0; i < rows.size(); i++) {
            StudentImportRow row = rows.get(i);
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("row", i + 2);
            result.put("rollNumber", row.getRollNumber());
            try {
                if (userRepository.existsByEmail(row.getEmail())) {
                    throw new IllegalStateException("Email already exists: " + row.getEmail());
                }
                if (studentRepository.existsByRollNumber(row.getRollNumber())) {
                    throw new IllegalStateException("Roll number already exists: " + row.getRollNumber());
                }
                String initialPassword = generateInitialPassword();
                User user = userRepository.save(User.builder()
                        .name(row.getName()).email(row.getEmail()).phone(row.getPhone())
                        .password(passwordEncoder.encode(initialPassword))
                        .role(User.Role.STUDENT).active(true).build());

                StudentRequest req = new StudentRequest();
                req.setUserId(user.getId());
                req.setRollNumber(row.getRollNumber());
                req.setDepartmentId(row.getDepartmentId());
                req.setSemester(row.getSemester());
                req.setBatch(row.getBatch());
                req.setJoinDate(row.getJoinDate() != null ? row.getJoinDate() : LocalDate.now());
                req.setStatus(row.getStatus() != null ? row.getStatus() : "ACTIVE");
                req.setGuardianName(row.getGuardianName());
                req.setGuardianPhone(row.getGuardianPhone());
                req.setAddress(row.getAddress());
                studentService.create(req);

                result.put("success", true);
                result.put("message", "Imported successfully");
                result.put("initialPassword", initialPassword);   // admin must distribute then user resets
                success++;
            } catch (IllegalStateException | IllegalArgumentException e) {
                log.warn("Student import row {}: {}", i + 2, e.getMessage());
                result.put("success", false);
                result.put("message", e.getMessage());
                failure++;
            } catch (Exception e) {
                log.error("Student import row {} unexpected error", i + 2, e);
                result.put("success", false);
                result.put("message", "Unexpected error — contact system administrator");
                failure++;
            }
            results.add(result);
        }

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("successCount", success);
        summary.put("failureCount", failure);
        summary.put("results", results);
        return ResponseEntity.ok(ApiResponse.ok("Import complete", summary));
    }

    // ── MyInfo: combined profile + bank info ──────────────────────────────────────

    @GetMapping("/me/info")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMyInfo(
            @AuthenticationPrincipal User currentUser) {
        Student student = studentRepository.findByUserId(currentUser.getId())
                .orElse(null);
        StudentBankInfo bank = student != null
                ? bankInfoRepository.findByStudentId(student.getId()).orElse(null)
                : null;

        Map<String, Object> data = new java.util.LinkedHashMap<>();
        data.put("user",    currentUser);
        data.put("student", student);
        data.put("bankInfo", bank);
        return ResponseEntity.ok(ApiResponse.ok(data));
    }

    @GetMapping("/me/bank-info")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<StudentBankInfo>> getBankInfo(
            @AuthenticationPrincipal User currentUser) {
        Student student = studentRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new IllegalStateException("Student profile not found"));
        StudentBankInfo info = bankInfoRepository.findByStudentId(student.getId()).orElse(null);
        return ResponseEntity.ok(ApiResponse.ok(info));
    }

    @PutMapping("/me/bank-info")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<StudentBankInfo>> saveBankInfo(
            @AuthenticationPrincipal User currentUser,
            @RequestBody Map<String, Object> body) {
        Student student = studentRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new IllegalStateException("Student profile not found"));
        StudentBankInfo info = bankInfoRepository.findByStudentId(student.getId())
                .orElse(StudentBankInfo.builder().studentId(student.getId()).build());
        if (body.get("accountHolderName") != null) info.setAccountHolderName(body.get("accountHolderName").toString());
        if (body.get("bankName")           != null) info.setBankName(body.get("bankName").toString());
        if (body.get("accountNumber")      != null) info.setAccountNumber(body.get("accountNumber").toString());
        if (body.get("ifscCode")           != null) info.setIfscCode(body.get("ifscCode").toString());
        if (body.get("branch")             != null) info.setBranch(body.get("branch").toString());
        return ResponseEntity.ok(ApiResponse.ok("Bank info saved", bankInfoRepository.save(info)));
    }
}
