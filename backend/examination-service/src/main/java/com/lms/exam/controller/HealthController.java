package com.lms.exam.controller;

import com.lms.exam.common.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/_health/exam")
public class HealthController {

    @Value("${spring.application.name:unknown}")
    private String serviceName;

    @GetMapping
    public ApiResponse<Map<String, Object>> health() {
        return ApiResponse.success("ok", Map.of(
                "service", serviceName,
                "status",  "UP",
                "implemented", false,
                "time",    Instant.now().toString()));
    }
}
