package com.lms.research.controller;

import com.lms.research.common.ApiResponse;
import com.lms.research.model.ResearchProfile;
import com.lms.research.model.WeeklyLog;
import com.lms.research.repository.ResearchProfileRepository;
import com.lms.research.repository.WeeklyLogRepository;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/research")
@RequiredArgsConstructor
public class ResearchController {

    private final ResearchProfileRepository profileRepo;
    private final WeeklyLogRepository       logRepo;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<ResearchProfile>> profile(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                profileRepo.findByStudentId(UUID.fromString(userId)).orElse(null)));
    }

    @GetMapping("/weekly-logs")
    public ResponseEntity<ApiResponse<List<WeeklyLog>>> myLogs(
            @RequestHeader("X-User-Id") String userId) {
        ResearchProfile p = profileRepo.findByStudentId(UUID.fromString(userId)).orElse(null);
        if (p == null) return ResponseEntity.ok(ApiResponse.success("OK", List.of()));
        return ResponseEntity.ok(ApiResponse.success("OK",
                logRepo.findByResearchIdOrderByWeekNumberDesc(p.getId())));
    }

    @PostMapping("/weekly-logs")
    @Transactional
    public ResponseEntity<ApiResponse<WeeklyLog>> submitLog(
            @RequestHeader("X-User-Id") String userId,
            @org.springframework.web.bind.annotation.RequestBody @jakarta.validation.Valid LogRequest req) {
        ResearchProfile p = profileRepo.findByStudentId(UUID.fromString(userId))
                .orElseThrow(() -> new IllegalArgumentException("No research profile for this user"));
        if (logRepo.existsByResearchIdAndWeekNumber(p.getId(), req.getWeekNumber()))
            throw new IllegalStateException("Log for that week already submitted");
        WeeklyLog saved = logRepo.save(WeeklyLog.builder()
                .researchId(p.getId())
                .weekNumber(req.getWeekNumber())
                .hoursWorked(req.getHoursWorked())
                .workSummary(req.getWorkSummary())
                .build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Log submitted", saved));
    }

    @Data
    public static class LogRequest {
        @NotNull private Integer weekNumber;
        private Integer hoursWorked;
        @NotBlank private String workSummary;
    }
}
