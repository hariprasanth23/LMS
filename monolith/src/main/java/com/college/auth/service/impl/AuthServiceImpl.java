package com.college.auth.service.impl;

import com.college.auth.dto.request.LoginRequest;
import com.college.auth.dto.request.RegisterRequest;
import com.college.auth.dto.response.AuthResponse;
import com.college.auth.model.RefreshToken;
import com.college.auth.model.User;
import com.college.auth.repository.RefreshTokenRepository;
import com.college.auth.repository.UserRepository;
import com.college.auth.security.JwtUtil;
import com.college.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    // min 8 chars, at least one uppercase, one lowercase, one digit, one special character
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{8,}$"
    );

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        validatePasswordStrength(request.getPassword());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalStateException("Email already registered: " + request.getEmail());
        }

        User.Role role = (request.getRole() != null) ? request.getRole() : User.Role.STUDENT;

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase().strip())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .active(true)
                .build();

        user = userRepository.save(user);
        log.info("Registered new user [id={}, email={}]", user.getId(), user.getEmail());

        return buildAuthResponse(user);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        String identifier = request.getIdentifier().strip();

        User user = userRepository.findByEmailOrPhone(identifier, identifier)
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new IllegalStateException("Account is deactivated");
        }

        log.info("User logged in [id={}, email={}]", user.getId(), user.getEmail());
        return buildAuthResponse(user);
    }

    // ---- Private helpers ----

    private AuthResponse buildAuthResponse(User user) {
        String accessToken  = jwtUtil.generateToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        // Persist refresh token — remove old ones first to avoid stale rows
        refreshTokenRepository.deleteByUser(user);
        RefreshToken rt = RefreshToken.builder()
                .user(user)
                .token(refreshToken)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();
        refreshTokenRepository.save(rt);

        return AuthResponse.builder()
                .token(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    private void validatePasswordStrength(String password) {
        if (password == null || !PASSWORD_PATTERN.matcher(password).matches()) {
            throw new IllegalArgumentException(
                    "Password must be at least 8 characters and contain uppercase, lowercase, digit, and special character"
            );
        }
    }
}
