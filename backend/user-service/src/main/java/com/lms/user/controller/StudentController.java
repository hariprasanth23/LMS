package com.lms.user.controller;

import com.lms.user.common.ApiResponse;
import com.lms.user.dto.BankInfoRequest;
import com.lms.user.dto.StudentRequest;
import com.lms.user.model.Student;
import com.lms.user.model.StudentBankInfo;
import com.lms.user.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService svc;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Student>>> list(
            @RequestHeader("X-User-Role") String role, Pageable p) {
        requireAdminOrFaculty(role);
        return ResponseEntity.ok(ApiResponse.success("OK", svc.page(p)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Student>> me(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK", svc.findByUserId(UUID.fromString(userId))));
    }

    @GetMapping("/me/info")
    public ResponseEntity<ApiResponse<Map<String, Object>>> meInfo(@RequestHeader("X-User-Id") String userId) {
        UUID uid = UUID.fromString(userId);
        Student s = svc.findByUserId(uid);
        StudentBankInfo b = svc.bankInfoForUser(uid);
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("profile", s);
        out.put("bankInfo", b);
        return ResponseEntity.ok(ApiResponse.success("OK", out));
    }

    @GetMapping("/me/bank-info")
    public ResponseEntity<ApiResponse<StudentBankInfo>> myBank(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                svc.bankInfoForUser(UUID.fromString(userId))));
    }

    @PutMapping("/me/bank-info")
    public ResponseEntity<ApiResponse<StudentBankInfo>> putBank(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody BankInfoRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Bank info saved",
                svc.saveBankInfo(UUID.fromString(userId), req)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Student>> byId(
            @RequestHeader("X-User-Role") String role, @PathVariable UUID id) {
        requireAdminOrFaculty(role);
        return ResponseEntity.ok(ApiResponse.success("OK", svc.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Student>> create(
            @RequestHeader("X-User-Role") String role,
            @Valid @RequestBody StudentRequest req) {
        requireAdmin(role);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Student created", svc.create(req)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Student>> update(
            @RequestHeader("X-User-Role") String role,
            @PathVariable UUID id,
            @Valid @RequestBody StudentRequest req) {
        requireAdmin(role);
        return ResponseEntity.ok(ApiResponse.success("Student updated", svc.update(id, req)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @RequestHeader("X-User-Role") String role, @PathVariable UUID id) {
        requireAdmin(role);
        svc.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Student deleted"));
    }

    // ── guards ────────────────────────────────────────────────────────────────
    private static void requireAdmin(String role) {
        if (!"ADMIN".equals(role)) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin role required");
    }
    private static void requireAdminOrFaculty(String role) {
        if (!"ADMIN".equals(role) && !"FACULTY".equals(role) && !"STAFF".equals(role))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin or faculty role required");
    }
}
