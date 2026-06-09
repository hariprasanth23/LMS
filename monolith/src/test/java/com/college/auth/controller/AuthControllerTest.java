package com.college.auth.controller;

import com.college.auth.dto.response.AuthResponse;
import com.college.auth.model.User;
import com.college.auth.repository.UserRepository;
import com.college.auth.security.JwtUtil;
import com.college.auth.service.AuthService;
import com.college.common.config.SecurityConfig;
import com.college.support.WithMockCollegeUser;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@Import(SecurityConfig.class)
class AuthControllerTest {

    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper json;

    // ── Service + security beans needed by the web slice ─────────────────────
    @MockBean private AuthService authService;
    @MockBean private UserRepository userRepository;
    @MockBean private PasswordEncoder passwordEncoder;
    @MockBean private JwtUtil jwtUtil;
    @MockBean private UserDetailsService userDetailsService;

    // ── Shared test data ──────────────────────────────────────────────────────

    private static final UUID USER_ID = UUID.randomUUID();

    private AuthResponse stubAuthResponse() {
        return AuthResponse.builder()
                .token("access-token")
                .refreshToken("refresh-token")
                .userId(USER_ID)
                .name("Alice")
                .email("alice@college.com")
                .role(User.Role.STUDENT)
                .build();
    }

    // ── POST /api/auth/register ───────────────────────────────────────────────

    @Test
    void register_validRequest_returns201WithToken() throws Exception {
        when(authService.register(any())).thenReturn(stubAuthResponse());

        String body = json.writeValueAsString(Map.of(
                "name", "Alice Smith",
                "email", "alice@college.com",
                "password", "Strong@123"
        ));

        mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("access-token"))
                .andExpect(jsonPath("$.data.role").value("STUDENT"));
    }

    @Test
    void register_blankName_returns400WithFieldError() throws Exception {
        String body = json.writeValueAsString(Map.of(
                "name", "",
                "email", "alice@college.com",
                "password", "Strong@123"
        ));

        mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.data.name").exists());
    }

    @Test
    void register_invalidEmail_returns400WithFieldError() throws Exception {
        String body = json.writeValueAsString(Map.of(
                "name", "Alice",
                "email", "not-an-email",
                "password", "Strong@123"
        ));

        mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.data.email").exists());
    }

    @Test
    void register_missingPassword_returns400WithFieldError() throws Exception {
        // password field absent entirely
        String body = json.writeValueAsString(Map.of(
                "name", "Alice",
                "email", "alice@college.com"
        ));

        mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.data.password").exists());
    }

    // ── POST /api/auth/login ──────────────────────────────────────────────────

    @Test
    void login_validCredentials_returns200AndSetsCookie() throws Exception {
        when(authService.login(any())).thenReturn(stubAuthResponse());

        String body = json.writeValueAsString(Map.of(
                "identifier", "alice@college.com",
                "password", "Strong@123"
        ));

        mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("access-token"))
                .andExpect(header().string("Set-Cookie", containsString("jwt_token")))
                .andExpect(header().string("Set-Cookie", containsString("HttpOnly")));
    }

    @Test
    void login_blankIdentifier_returns400WithFieldError() throws Exception {
        String body = json.writeValueAsString(Map.of(
                "identifier", "",
                "password", "any"
        ));

        mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.data.identifier").exists());
    }

    @Test
    void login_blankPassword_returns400WithFieldError() throws Exception {
        String body = json.writeValueAsString(Map.of(
                "identifier", "alice@college.com",
                "password", ""
        ));

        mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.data.password").exists());
    }

    // ── POST /api/auth/logout ─────────────────────────────────────────────────

    @Test
    void logout_clearsJwtCookie() throws Exception {
        mvc.perform(post("/api/auth/logout"))
                .andExpect(status().isOk())
                .andExpect(header().string("Set-Cookie", containsString("jwt_token=")))
                .andExpect(header().string("Set-Cookie", containsString("Max-Age=0")));
    }

    // ── GET /api/auth/me ──────────────────────────────────────────────────────

    @Test
    @WithMockCollegeUser(email = "alice@college.com", role = "STUDENT")
    void me_authenticated_returnsUserInfo() throws Exception {
        mvc.perform(get("/api/auth/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("alice@college.com"))
                .andExpect(jsonPath("$.data.role").value("STUDENT"));
    }

    @Test
    void me_unauthenticated_returns403() throws Exception {
        mvc.perform(get("/api/auth/me"))
                .andExpect(status().isForbidden());
    }

    // ── POST /api/auth/refresh ────────────────────────────────────────────────

    @Test
    void refresh_validToken_returns200AndRotatesCookie() throws Exception {
        when(authService.refresh("good-refresh")).thenReturn(stubAuthResponse());

        mvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(Map.of("refreshToken", "good-refresh"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("access-token"))
                .andExpect(header().string("Set-Cookie", containsString("jwt_token")))
                .andExpect(header().string("Set-Cookie", containsString("HttpOnly")));
    }

    @Test
    void refresh_missingRefreshToken_returns400() throws Exception {
        mvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(Map.of())))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void refresh_invalidToken_returns400() throws Exception {
        when(authService.refresh("bad-token"))
                .thenThrow(new IllegalArgumentException("Invalid refresh token"));

        mvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(Map.of("refreshToken", "bad-token"))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid refresh token"));
    }
}
