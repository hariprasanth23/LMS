package com.lms.exam.controller;

import com.lms.exam.common.ApiResponse;
import com.lms.exam.model.Entities.MakeupApplication;
import com.lms.exam.repository.ExamRepositories.MakeupRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/examination/makeup")
@RequiredArgsConstructor
public class MakeupController {

    private final MakeupRepository repo;

    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<List<MakeupApplication>>> applications(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                repo.findByStudentIdOrderByAppliedAtDesc(UUID.fromString(userId))));
    }

    @PostMapping("/apply")
    public ResponseEntity<ApiResponse<MakeupApplication>> apply(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody Req req) {
        MakeupApplication saved = repo.save(MakeupApplication.builder()
                .studentId(UUID.fromString(userId))
                .courseId(req.getCourseId())
                .reason(req.getReason()).status("PENDING").build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Submitted", saved));
    }

    @Data public static class Req {
        @NotNull private UUID courseId;
        @NotBlank private String reason;
    }
}
