package com.lms.course.controller;

import com.lms.course.common.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Placeholder for routes that the gateway sends here but that haven't been
 * implemented yet. Returns HTTP 501 with a structured payload so the frontend
 * can degrade gracefully instead of seeing white-label 404s.
 *
 * <p>When a real controller for one of these paths is added, it takes priority
 * (more specific match) and this stub falls out of the way.
 */
@Slf4j
@RestController
public class PlaceholderController {

    @RequestMapping(value = { "/api/courses/**", "/api/assignments/**", "/api/quizzes/**", "/api/announcements/**", "/api/enrollments/**" },
            method = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
                       RequestMethod.PATCH, RequestMethod.DELETE })
    public ResponseEntity<ApiResponse<Map<String, Object>>> notImplemented(
            @RequestHeader(value = "X-User-Id",   required = false) String userId,
            @RequestHeader(value = "X-User-Role", required = false) String role) {

        log.info("Stub hit: user={} role={}", userId, role);
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
                .body(ApiResponse.error("Endpoint not yet implemented in v2.0",
                        Map.of("status", 501, "phase", "scaffolding")));
    }
}
