package com.lms.auth.service;

import com.lms.auth.dto.*;
import com.lms.auth.model.RefreshToken;
import com.lms.auth.model.User;
import com.lms.auth.repository.RefreshTokenRepository;
import com.lms.auth.repository.UserRepository;
import com.lms.auth.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    // 8+ chars, ≥1 lower, ≥1 upper, ≥1 digit, ≥1 ASCII printable symbol from
    // the explicit list. Whitespace and non-printables are rejected (the old
    // `[^a-zA-Z\d]` accepted a single space).
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:'\",.<>/?~`|\\\\])"
                    + "[A-Za-z\\d!@#$%^&*()_+\\-=\\[\\]{};:'\",.<>/?~`|\\\\]{8,128}$");

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    @Transactional
    public LoginResponse register(RegisterRequest req) {
        validatePassword(req.getPassword());
        String email = req.getEmail().toLowerCase().strip();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalStateException("Email already registered: " + email);
        }
        User user = User.builder()
                .name(req.getName().strip())
                .email(email)
                .phone(req.getPhone())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .role(User.Role.STUDENT)
                .active(true)
                .build();
        user = userRepository.save(user);
        log.info("Registered user id={} email={}", user.getId(), user.getEmail());
        return issueTokens(user);
    }

    @Override
    @Transactional
    public LoginResponse login(LoginRequest req) {
        String id = req.getIdentifier().strip();
        User user = userRepository.findByEmailOrPhone(id)
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials");
        }
        if (!user.isActive()) {
            throw new IllegalStateException("Account is deactivated");
        }
        log.info("Login user id={} email={}", user.getId(), user.getEmail());
        return issueTokens(user);
    }

    @Override
    @Transactional
    public LoginResponse refresh(String rawToken) {
        RefreshToken stored = refreshTokenRepository.findByToken(rawToken)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        if (stored.isExpired()) {
            refreshTokenRepository.delete(stored);
            throw new IllegalStateException("Refresh token expired — please log in again");
        }
        User user = stored.getUser();
        refreshTokenRepository.delete(stored);   // rotation: one-time use
        log.info("Refreshed tokens for user id={}", user.getId());
        return issueTokens(user);
    }

    @Override
    @Transactional
    public void logout(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) return;
        refreshTokenRepository.findByToken(rawToken).ifPresent(refreshTokenRepository::delete);
    }

    @Override
    public UserDto getProfile(String userId) {
        User user = findOrThrow(userId);
        return toDto(user);
    }

    @Override
    @Transactional
    public UserDto updateProfile(String userId, UpdateProfileRequest req) {
        User user = findOrThrow(userId);
        if (req.getName()  != null && !req.getName().isBlank())  user.setName(req.getName().strip());
        if (req.getPhone() != null) user.setPhone(req.getPhone());
        if (req.getProfilePhoto() != null) user.setProfilePhoto(req.getProfilePhoto());
        return toDto(userRepository.save(user));
    }

    @Override
    @Transactional
    public void changePassword(String userId, ChangePasswordRequest req) {
        User user = findOrThrow(userId);
        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Current password is incorrect");
        }
        validatePassword(req.getNewPassword());
        user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
        // Invalidate all refresh tokens for this user — force re-login on other devices
        refreshTokenRepository.deleteByUser(user);
        log.info("Password changed for user id={}", user.getId());
    }

    // ── helpers ─────────────────────────────────────────────────────────────────

    private User findOrThrow(String userId) {
        UUID uuid;
        try { uuid = UUID.fromString(userId); }
        catch (IllegalArgumentException e) { throw new IllegalArgumentException("Invalid user id"); }
        return userRepository.findById(uuid)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private LoginResponse issueTokens(User user) {
        String access  = jwtUtil.generateAccessToken(user);
        String refresh = jwtUtil.generateRefreshToken(user);

        refreshTokenRepository.deleteByUser(user);
        refreshTokenRepository.save(RefreshToken.builder()
                .user(user)
                .token(refresh)
                .expiresAt(Instant.now().plusMillis(jwtUtil.getRefreshValidityMs()))
                .build());

        return LoginResponse.builder()
                .accessToken(access)
                .refreshToken(refresh)
                .expiresInSeconds(jwtUtil.getAccessValidityMs() / 1000)
                .user(toDto(user))
                .build();
    }

    private UserDto toDto(User u) {
        return UserDto.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .phone(u.getPhone())
                .role(u.getRole().name())
                .profilePhoto(u.getProfilePhoto())
                .active(u.isActive())
                .build();
    }

    private void validatePassword(String pw) {
        if (pw == null || !PASSWORD_PATTERN.matcher(pw).matches()) {
            throw new IllegalArgumentException(
                "Password must be 8–128 characters with at least one uppercase letter, " +
                "one lowercase letter, one digit, and one of these symbols: " +
                "! @ # $ % ^ & * ( ) _ + - = [ ] { } ; : ' \" , . < > / ? ~ ` | \\");
        }
    }
}
