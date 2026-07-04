package com.lms.gateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

/**
 * Circuit-breaker fallback. Spring Cloud Gateway forwards to {@code /api/_fallback/<svc>}
 * when the underlying service is unavailable, slow, or tripping the breaker.
 * Returns 503 + a structured ApiResponse-shape body so the frontend can
 * differentiate "service down" from "endpoint not implemented" (501) and
 * "real bug" (500).
 */
@RestController
@RequestMapping("/api/_fallback")
public class FallbackController {

    @RequestMapping("/auth")
    public ResponseEntity<Map<String, Object>> auth()       { return body("auth-service"); }
    @RequestMapping("/user")
    public ResponseEntity<Map<String, Object>> user()       { return body("user-service"); }
    @RequestMapping("/course")
    public ResponseEntity<Map<String, Object>> course()     { return body("course-service"); }
    @RequestMapping("/exam")
    public ResponseEntity<Map<String, Object>> exam()       { return body("examination-service"); }
    @RequestMapping("/attendance")
    public ResponseEntity<Map<String, Object>> attendance() { return body("attendance-service"); }
    @RequestMapping("/finance")
    public ResponseEntity<Map<String, Object>> finance()    { return body("finance-service"); }
    @RequestMapping("/hr")
    public ResponseEntity<Map<String, Object>> hr()         { return body("hr-service"); }
    @RequestMapping("/notification")
    public ResponseEntity<Map<String, Object>> notification(){ return body("notification-service"); }
    @RequestMapping("/academics")
    public ResponseEntity<Map<String, Object>> academics()  { return body("academics-service"); }
    @RequestMapping("/feedback")
    public ResponseEntity<Map<String, Object>> feedback()   { return body("feedback-service"); }
    @RequestMapping("/research")
    public ResponseEntity<Map<String, Object>> research()   { return body("research-service"); }
    @RequestMapping("/services")
    public ResponseEntity<Map<String, Object>> services()   { return body("student-services"); }
    // (the /monolith fallback used to live here; the monolith is deleted.)

    private ResponseEntity<Map<String, Object>> body(String svc) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
                "success",   false,
                "message",   svc + " is unavailable — please retry shortly",
                "data",      Map.of("service", svc, "status", 503, "phase", "circuit-open"),
                "timestamp", Instant.now().toString()));
    }
}
