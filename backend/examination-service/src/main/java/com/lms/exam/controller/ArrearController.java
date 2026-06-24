package com.lms.exam.controller;

import com.lms.exam.common.ApiResponse;
import com.lms.exam.model.Entities.ArrearRegistration;
import com.lms.exam.model.Entities.ExamSchedule;
import com.lms.exam.repository.ExamRepositories.ArrearRepository;
import com.lms.exam.repository.ExamRepositories.ExamScheduleRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/examination/arrear")
@RequiredArgsConstructor
public class ArrearController {

    private final ArrearRepository arrearRepo;
    private final ExamScheduleRepository scheduleRepo;

    @GetMapping("/eligible")
    public ResponseEntity<ApiResponse<List<String>>> eligible(@RequestHeader("X-User-Id") String userId) {
        // v2 minimal: looking up FAILED/INCOMPLETE grades would require a
        // cross-table join. Frontend currently uses this purely as a heads-up;
        // returning an empty list keeps the UI quiet until the policy is wired.
        return ResponseEntity.ok(ApiResponse.success("OK", List.of()));
    }

    @GetMapping("/registrations")
    public ResponseEntity<ApiResponse<List<ArrearRegistration>>> mine(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK", arrearRepo.findByStudentId(UUID.fromString(userId))));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<ArrearRegistration>> register(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody Req req) {
        ArrearRegistration saved = arrearRepo.save(ArrearRegistration.builder()
                .studentId(UUID.fromString(userId)).courseCode(req.getCourseCode())
                .registrationDate(LocalDate.now()).status("REGISTERED").build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Registered", saved));
    }

    @GetMapping("/schedule")
    public ResponseEntity<ApiResponse<List<ExamSchedule>>> arrearSchedule() {
        return ResponseEntity.ok(ApiResponse.success("OK", scheduleRepo.findAllByOrderByExamDateAsc()));
    }

    @GetMapping("/attempts")
    public ResponseEntity<ApiResponse<List<ArrearRegistration>>> attempts(@RequestHeader("X-User-Id") String userId) {
        return mine(userId);  // alias — frontend distinguishes by tab
    }

    @Data public static class Req {
        @NotBlank private String courseCode;
    }
}
