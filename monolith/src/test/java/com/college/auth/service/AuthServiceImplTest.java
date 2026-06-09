package com.college.auth.service;

import com.college.auth.dto.request.LoginRequest;
import com.college.auth.dto.request.RegisterRequest;
import com.college.auth.dto.response.AuthResponse;
import com.college.auth.model.RefreshToken;
import com.college.auth.model.User;
import com.college.auth.repository.RefreshTokenRepository;
import com.college.auth.repository.UserRepository;
import com.college.auth.security.JwtUtil;
import com.college.auth.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock private UserRepository userRepository;
    @Mock private RefreshTokenRepository refreshTokenRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;

    @InjectMocks private AuthServiceImpl authService;

    private RegisterRequest validRegister;
    private User savedUser;

    @BeforeEach
    void setUp() {
        validRegister = new RegisterRequest();
        validRegister.setName("Alice Smith");
        validRegister.setEmail("alice@college.com");
        validRegister.setPhone("9876543210");
        validRegister.setPassword("Strong@123");

        savedUser = User.builder()
                .id(UUID.randomUUID())
                .name("Alice Smith")
                .email("alice@college.com")
                .password("$2a$encoded")
                .role(User.Role.STUDENT)
                .active(true)
                .build();
    }

    // ── register ─────────────────────────────────────────────────────────────

    @Test
    void register_validRequest_savesUserAndReturnsTokens() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$encoded");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtUtil.generateToken(any())).thenReturn("access-token");
        when(jwtUtil.generateRefreshToken(any())).thenReturn("refresh-token");
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(new RefreshToken());

        AuthResponse result = authService.register(validRegister);

        assertThat(result.getToken()).isEqualTo("access-token");
        assertThat(result.getRefreshToken()).isEqualTo("refresh-token");
        assertThat(result.getEmail()).isEqualTo("alice@college.com");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_alwaysAssignsStudentRole() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$encoded");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            assertThat(u.getRole()).isEqualTo(User.Role.STUDENT);
            return savedUser;
        });
        when(jwtUtil.generateToken(any())).thenReturn("token");
        when(jwtUtil.generateRefreshToken(any())).thenReturn("refresh");
        when(refreshTokenRepository.save(any())).thenReturn(new RefreshToken());

        authService.register(validRegister);

        verify(userRepository).save(argThat(u -> u.getRole() == User.Role.STUDENT));
    }

    @Test
    void register_duplicateEmail_throwsIllegalState() {
        when(userRepository.existsByEmail("alice@college.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(validRegister))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("alice@college.com");

        verify(userRepository, never()).save(any());
    }

    @Test
    void register_passwordTooShort_throwsIllegalArgument() {
        validRegister.setPassword("Ab1!");

        assertThatThrownBy(() -> authService.register(validRegister))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Password must be at least 8 characters");
    }

    @Test
    void register_passwordNoUppercase_throwsIllegalArgument() {
        validRegister.setPassword("alllower@1");

        assertThatThrownBy(() -> authService.register(validRegister))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void register_passwordNoSpecialChar_throwsIllegalArgument() {
        validRegister.setPassword("NoSpecial1");

        assertThatThrownBy(() -> authService.register(validRegister))
                .isInstanceOf(IllegalArgumentException.class);
    }

    // ── login ─────────────────────────────────────────────────────────────────

    @Test
    void login_validCredentials_returnsAuthResponse() {
        LoginRequest req = new LoginRequest();
        req.setIdentifier("alice@college.com");
        req.setPassword("Strong@123");

        when(userRepository.findByEmailOrPhone("alice@college.com", "alice@college.com"))
                .thenReturn(Optional.of(savedUser));
        when(passwordEncoder.matches("Strong@123", "$2a$encoded")).thenReturn(true);
        when(jwtUtil.generateToken(any())).thenReturn("access-token");
        when(jwtUtil.generateRefreshToken(any())).thenReturn("refresh-token");
        when(refreshTokenRepository.save(any())).thenReturn(new RefreshToken());

        AuthResponse result = authService.login(req);

        assertThat(result.getToken()).isEqualTo("access-token");
        assertThat(result.getRole()).isEqualTo(User.Role.STUDENT);
    }

    @Test
    void login_userNotFound_throwsBadCredentials() {
        LoginRequest req = new LoginRequest();
        req.setIdentifier("unknown@college.com");
        req.setPassword("any");

        when(userRepository.findByEmailOrPhone(anyString(), anyString())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    void login_wrongPassword_throwsBadCredentials() {
        LoginRequest req = new LoginRequest();
        req.setIdentifier("alice@college.com");
        req.setPassword("WrongPass@1");

        when(userRepository.findByEmailOrPhone(anyString(), anyString()))
                .thenReturn(Optional.of(savedUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    void login_deactivatedAccount_throwsIllegalState() {
        LoginRequest req = new LoginRequest();
        req.setIdentifier("alice@college.com");
        req.setPassword("Strong@123");

        User inactive = User.builder()
                .id(UUID.randomUUID())
                .email("alice@college.com")
                .password("$2a$encoded")
                .role(User.Role.STUDENT)
                .active(false)
                .build();

        when(userRepository.findByEmailOrPhone(anyString(), anyString()))
                .thenReturn(Optional.of(inactive));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("deactivated");
    }

    // ── refresh ───────────────────────────────────────────────────────────────

    @Test
    void refresh_validToken_issuesNewPairAndRotatesOldToken() {
        RefreshToken stored = RefreshToken.builder()
                .token("old-refresh")
                .user(savedUser)
                .expiresAt(LocalDateTime.now().plusDays(6))
                .build();

        when(refreshTokenRepository.findByToken("old-refresh")).thenReturn(Optional.of(stored));
        when(jwtUtil.generateToken(any())).thenReturn("new-access");
        when(jwtUtil.generateRefreshToken(any())).thenReturn("new-refresh");
        when(refreshTokenRepository.save(any())).thenReturn(new RefreshToken());

        AuthResponse result = authService.refresh("old-refresh");

        assertThat(result.getToken()).isEqualTo("new-access");
        assertThat(result.getRefreshToken()).isEqualTo("new-refresh");
        // old token must be deleted (rotation)
        verify(refreshTokenRepository).delete(stored);
    }

    @Test
    void refresh_expiredToken_throwsIllegalStateAndDeletesToken() {
        RefreshToken expired = RefreshToken.builder()
                .token("expired-refresh")
                .user(savedUser)
                .expiresAt(LocalDateTime.now().minusDays(1))
                .build();

        when(refreshTokenRepository.findByToken("expired-refresh")).thenReturn(Optional.of(expired));

        assertThatThrownBy(() -> authService.refresh("expired-refresh"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Refresh token has expired");

        verify(refreshTokenRepository).delete(expired);
        verify(jwtUtil, never()).generateToken(any());
    }

    @Test
    void refresh_unknownToken_throwsIllegalArgument() {
        when(refreshTokenRepository.findByToken("unknown")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.refresh("unknown"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid refresh token");

        verify(jwtUtil, never()).generateToken(any());
    }

    @Test
    void refresh_deletesOldTokenBeforeIssuingNew() {
        RefreshToken stored = RefreshToken.builder()
                .token("valid-refresh")
                .user(savedUser)
                .expiresAt(LocalDateTime.now().plusDays(5))
                .build();

        when(refreshTokenRepository.findByToken("valid-refresh")).thenReturn(Optional.of(stored));
        when(jwtUtil.generateToken(any())).thenReturn("t1");
        when(jwtUtil.generateRefreshToken(any())).thenReturn("t2");
        when(refreshTokenRepository.save(any())).thenReturn(new RefreshToken());

        authService.refresh("valid-refresh");

        // Rotation order: delete old, then deleteByUser (inside buildAuthResponse), then save new
        var inOrder = org.mockito.Mockito.inOrder(refreshTokenRepository);
        inOrder.verify(refreshTokenRepository).delete(stored);
        inOrder.verify(refreshTokenRepository).deleteByUser(savedUser);
        inOrder.verify(refreshTokenRepository).save(any(RefreshToken.class));
    }
}
