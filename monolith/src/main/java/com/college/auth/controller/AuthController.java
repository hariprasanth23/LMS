package com.college.auth.controller;

import com.college.auth.dto.request.LoginRequest;
import com.college.auth.dto.request.RegisterRequest;
import com.college.auth.dto.response.AuthResponse;
import com.college.auth.model.User;
import com.college.auth.repository.UserRepository;
import com.college.auth.service.AuthService;
import com.college.common.dto.ApiResponse;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
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
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        AuthResponse auth = authService.login(request);
        ResponseCookie cookie = ResponseCookie.from("jwt_token", auth.getToken())
                .httpOnly(true)
                .path("/")
                .maxAge(24 * 60 * 60)   // 1 day, matches JWT expiry
                .sameSite("Strict")
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
        return ResponseEntity.ok(ApiResponse.ok("Login successful", auth));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            @RequestBody Map<String, String> body,
            HttpServletResponse response) {
        String token = body.get("refreshToken");
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("refreshToken is required");
        }
        AuthResponse auth = authService.refresh(token);
        ResponseCookie cookie = ResponseCookie.from("jwt_token", auth.getToken())
                .httpOnly(true)
                .path("/")
                .maxAge(24 * 60 * 60)
                .sameSite("Strict")
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
        return ResponseEntity.ok(ApiResponse.ok("Token refreshed", auth));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(HttpServletResponse response) {
        ResponseCookie clear = ResponseCookie.from("jwt_token", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();
        response.addHeader("Set-Cookie", clear.toString());
        return ResponseEntity.ok(ApiResponse.ok("Logged out successfully", "OK"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> me(@AuthenticationPrincipal User user) {
        // Use a mutable map: Map.of() throws NullPointerException on any null value,
        // and createdAt can be null for programmatically-created test/seed users.
        Map<String, Object> info = new java.util.LinkedHashMap<>();
        info.put("userId",       user.getId());
        info.put("name",         user.getName());
        info.put("email",        user.getEmail());
        info.put("phone",        user.getPhone()        != null ? user.getPhone()        : "");
        info.put("role",         user.getRole());
        info.put("active",       user.getActive());
        info.put("profilePhoto", user.getProfilePhoto() != null ? user.getProfilePhoto() : "");
        info.put("createdAt",    user.getCreatedAt());   // null-safe: LinkedHashMap allows null values
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
