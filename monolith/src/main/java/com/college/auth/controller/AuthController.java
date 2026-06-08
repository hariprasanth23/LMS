package com.college.auth.controller;

import com.college.auth.dto.request.LoginRequest;
import com.college.auth.dto.request.RegisterRequest;
import com.college.auth.dto.response.AuthResponse;
import com.college.auth.model.User;
import com.college.auth.repository.UserRepository;
import com.college.auth.service.AuthService;
import com.college.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("User registered successfully", authService.register(request)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Login successful", authService.login(request)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> me(@AuthenticationPrincipal User user) {
        Map<String, Object> info = Map.of(
                "userId",       user.getId(),
                "name",         user.getName(),
                "email",        user.getEmail(),
                "phone",        user.getPhone() != null ? user.getPhone() : "",
                "role",         user.getRole(),
                "active",       user.getActive(),
                "profilePhoto", user.getProfilePhoto() != null ? user.getProfilePhoto() : "",
                "createdAt",    user.getCreatedAt()
        );
        return ResponseEntity.ok(ApiResponse.ok(info));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<String>> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {
        User u = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalStateException("User not found"));
        if (body.get("name")  != null) u.setName(body.get("name").toString());
        if (body.get("phone") != null) u.setPhone(body.get("phone").toString());
        userRepository.save(u);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated", "OK"));
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {
        String currentPassword = body.getOrDefault("currentPassword", "").toString();
        String newPassword     = body.getOrDefault("newPassword",     "").toString();

        User u = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalStateException("User not found"));

        if (!passwordEncoder.matches(currentPassword, u.getPassword()))
            throw new IllegalArgumentException("Current password is incorrect");
        if (newPassword.length() < 8)
            throw new IllegalArgumentException("New password must be at least 8 characters");

        u.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(u);
        log.info("Password changed for user [id={}]", u.getId());
        return ResponseEntity.ok(ApiResponse.ok("Password changed successfully", "OK"));
    }

    @PutMapping("/update-email")
    public ResponseEntity<ApiResponse<String>> updateEmail(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {
        String newEmail = body.getOrDefault("newEmail", "").toString().toLowerCase().strip();
        if (newEmail.isEmpty()) throw new IllegalArgumentException("Email cannot be empty");
        if (userRepository.existsByEmail(newEmail))
            throw new IllegalStateException("Email already in use");
        User u = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalStateException("User not found"));
        u.setEmail(newEmail);
        userRepository.save(u);
        return ResponseEntity.ok(ApiResponse.ok("Email updated successfully", "OK"));
    }

    @PutMapping("/update-mobile")
    public ResponseEntity<ApiResponse<String>> updateMobile(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {
        String newMobile = body.getOrDefault("newMobile", "").toString().strip();
        if (newMobile.isEmpty()) throw new IllegalArgumentException("Mobile cannot be empty");
        User u = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalStateException("User not found"));
        u.setPhone(newMobile);
        userRepository.save(u);
        return ResponseEntity.ok(ApiResponse.ok("Mobile updated successfully", "OK"));
    }
}
