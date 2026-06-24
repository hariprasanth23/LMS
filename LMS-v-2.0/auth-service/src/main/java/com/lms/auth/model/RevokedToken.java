package com.lms.auth.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "revoked_tokens")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RevokedToken {

    /** JWT `jti` claim — unique per token. */
    @Id
    @Column(nullable = false, columnDefinition = "TEXT")
    private String jti;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "revoked_at", nullable = false)
    @Builder.Default
    private Instant revokedAt = Instant.now();

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(nullable = false, length = 40)
    @Builder.Default
    private String reason = "logout";
}
