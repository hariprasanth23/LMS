package com.lms.auth.controller;

import com.lms.auth.common.ApiResponse;
import com.lms.auth.config.CookieProperties;
import com.lms.auth.dto.*;
import com.lms.auth.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService    authService;
    private final CookieProperties cookieProperties;

    // ── Public endpoints (gateway skips JWT) ──────────────────────────────────

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<LoginResponse>> register(@Valid @RequestBody RegisterRequest request) {
        LoginResponse resp = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, buildAccessCookie(resp.getAccessToken()).toString())
                .body(ApiResponse.success("Registration successful", resp));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse resp = authService.login(request);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, buildAccessCookie(resp.getAccessToken()).toString())
                .body(ApiResponse.success("Login successful", resp));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<LoginResponse>> refresh(
            @RequestBody(required = false) RefreshRequest body,
            @CookieValue(value = "lms_refresh", required = false) String refreshCookie) {

        String token = body != null && body.getRefreshToken() != null
                ? body.getRefreshToken()
                : refreshCookie;
        if (token == null || token.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Refresh token is required"));
        }
        LoginResponse resp = authService.refresh(token);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, buildAccessCookie(resp.getAccessToken()).toString())
                .body(ApiResponse.success("Token refreshed", resp));
    }

    // ── Authenticated endpoints (gateway injects X-User-Id) ───────────────────

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @CookieValue(value = "lms_token",   required = false) String accessCookie,
            @CookieValue(value = "lms_refresh", required = false) String refreshCookie,
            HttpServletResponse response) {
        authService.logout(refreshCookie, accessCookie);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, expireCookie("lms_token").toString())
                .header(HttpHeaders.SET_COOKIE, expireCookie("lms_refresh").toString())
                .body(ApiResponse.success("Logged out"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> me(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success("OK", authService.getProfile(userId)));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success("Profile updated", authService.updateProfile(userId, request)));
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @RequestHeader("X-User-Id") String userId,
            @CookieValue(value = "lms_token", required = false) String accessCookie,
            @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(userId, request, accessCookie);
        return ResponseEntity.ok()
                // Force re-login: blow the access cookie away
                .header(HttpHeaders.SET_COOKIE, expireCookie("lms_token").toString())
                .header(HttpHeaders.SET_COOKIE, expireCookie("lms_refresh").toString())
                .body(ApiResponse.success("Password changed"));
    }

    // ── cookie helpers ────────────────────────────────────────────────────────

    private ResponseCookie buildAccessCookie(String value) {
        return ResponseCookie.from("lms_token", value)
                .httpOnly(true)
                .secure(cookieProperties.isSecure())
                .sameSite(cookieProperties.getSameSite())
                .domain(cookieProperties.getDomain())
                .path("/")
                .maxAge(Duration.ofMillis(cookieProperties.getMaxAgeMs()))
                .build();
    }

    private ResponseCookie expireCookie(String name) {
        return ResponseCookie.from(name, "")
                .httpOnly(true)
                .secure(cookieProperties.isSecure())
                .sameSite(cookieProperties.getSameSite())
                .domain(cookieProperties.getDomain())
                .path("/")
                .maxAge(0)
                .build();
    }
}
