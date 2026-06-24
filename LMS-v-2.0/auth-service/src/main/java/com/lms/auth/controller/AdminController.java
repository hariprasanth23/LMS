package com.lms.auth.controller;

import com.lms.auth.common.ApiResponse;
import com.lms.auth.dto.UserDto;
import com.lms.auth.model.User;
import com.lms.auth.repository.RefreshTokenRepository;
import com.lms.auth.repository.UserRepository;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

/**
 * Internal admin-only endpoints. Reached through the gateway under
 * {@code /api/auth/admin/**}. The gateway routes them through
 * {@code JwtAuthFilter} (just like /me) so {@code X-User-Role} is set;
 * we enforce the ADMIN role here.
 *
 * <p>The first ADMIN must still be inserted via SQL or DataInitializer.
 * From then on, that ADMIN promotes others via these endpoints — no SQL
 * surgery on the live system.
 */
@Slf4j
@RestController
@RequestMapping("/api/auth/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository         userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> listUsers(
            @RequestHeader("X-User-Role") String requesterRole) {
        requireAdmin(requesterRole);
        List<UserDto> all = userRepository.findAll().stream().map(this::toDto).toList();
        return ResponseEntity.ok(ApiResponse.success("OK", all));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<UserDto>> changeRole(
            @RequestHeader("X-User-Role") String requesterRole,
            @PathVariable UUID id,
            @RequestBody @NotBlank RoleChange body) {
        requireAdmin(requesterRole);
        User.Role newRole;
        try { newRole = User.Role.valueOf(body.role().toUpperCase()); }
        catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + body.role());
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        User.Role prev = user.getRole();
        user.setRole(newRole);
        userRepository.save(user);
        // Invalidate refresh tokens — old JWT claims still encode the old role
        refreshTokenRepository.deleteByUser(user);
        log.info("Admin role-change: user={} {} -> {}", id, prev, newRole);
        return ResponseEntity.ok(ApiResponse.success("Role updated", toDto(user)));
    }

    @PutMapping("/users/{id}/deactivate")
    public ResponseEntity<ApiResponse<Void>> deactivate(
            @RequestHeader("X-User-Role") String requesterRole,
            @PathVariable UUID id) {
        requireAdmin(requesterRole);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setActive(false);
        userRepository.save(user);
        refreshTokenRepository.deleteByUser(user);
        log.info("Admin deactivated user={}", id);
        return ResponseEntity.ok(ApiResponse.success("User deactivated"));
    }

    private void requireAdmin(String role) {
        if (!"ADMIN".equals(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin role required");
        }
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

    public record RoleChange(@NotBlank String role) {}
}
