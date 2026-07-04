package com.lms.notification.controller;

import com.lms.notification.common.ApiResponse;
import com.lms.notification.model.Notification;
import com.lms.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository repo;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> list(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                repo.findByUserIdOrderByCreatedAtDesc(UUID.fromString(userId))));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> unread(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                Map.of("count", repo.countByUserIdAndReadFalse(UUID.fromString(userId)))));
    }

    @PostMapping("/mark-all-read")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Integer>>> markAll(@RequestHeader("X-User-Id") String userId) {
        int n = repo.markAllReadForUser(UUID.fromString(userId));
        return ResponseEntity.ok(ApiResponse.success("OK", Map.of("updated", n)));
    }
}
