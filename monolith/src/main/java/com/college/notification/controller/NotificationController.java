package com.college.notification.controller;

import com.college.auth.model.User;
import com.college.common.dto.ApiResponse;
import com.college.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository repo;

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(repo.findByUserIdOrderByCreatedAtDesc(user.getId())));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<?>> unreadCount(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(Map.of("count", repo.countByUserIdAndIsReadFalse(user.getId()))));
    }

    @PostMapping("/mark-all-read")
    public ResponseEntity<ApiResponse<?>> markAllRead(@AuthenticationPrincipal User user) {
        repo.markAllReadForUser(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("All notifications marked as read", null));
    }
}
