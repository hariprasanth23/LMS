package com.college.auth.controller;

import com.college.auth.dto.request.LoginRequest;
import com.college.auth.dto.request.RegisterRequest;
import com.college.auth.dto.response.AuthResponse;
import com.college.auth.model.User;
import com.college.auth.service.AuthService;
import com.college.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok("User registered successfully", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> me(
            @AuthenticationPrincipal User user) {
        Map<String, Object> info = Map.of(
                "userId",      user.getId(),
                "name",        user.getName(),
                "email",       user.getEmail(),
                "phone",       user.getPhone() != null ? user.getPhone() : "",
                "role",        user.getRole(),
                "active",      user.getActive(),
                "profilePhoto", user.getProfilePhoto() != null ? user.getProfilePhoto() : "",
                "createdAt",   user.getCreatedAt()
        );
        return ResponseEntity.ok(ApiResponse.ok(info));
    }
}
