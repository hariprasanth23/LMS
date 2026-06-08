package com.college.student.controller;

import com.college.auth.model.User;
import com.college.common.dto.ApiResponse;
import com.college.student.dto.StudentRequest;
import com.college.student.model.Student;
import com.college.student.model.StudentBankInfo;
import com.college.student.repository.StudentBankInfoRepository;
import com.college.student.repository.StudentRepository;
import com.college.student.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final StudentRepository studentRepository;
    private final StudentBankInfoRepository bankInfoRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<ApiResponse<List<Student>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(studentService.findAll()));
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
