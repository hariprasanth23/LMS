package com.lms.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;

/**
 * Publishes JWT JTI revocations to Redis with a TTL equal to the token's
 * remaining lifetime — so the entry self-cleans the moment the token would
 * have expired naturally. The api-gateway checks for {@code jwt:revoked:<jti>}
 * on every protected request.
 *
 * <p>Redis is optional in local dev. If autowiring fails (no Redis on the
 * classpath, or no redis bean), this component is omitted and only the
 * DB-side {@code RevokedToken} row is written — gateway revocation skips
 * silently. The DB row is the source of truth; Redis is the speed layer.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RevocationPublisher {

    public static final String KEY_PREFIX = "jwt:revoked:";

    @Autowired(required = false)
    private StringRedisTemplate redis;

    public void publish(String jti, Instant expiresAt) {
        if (redis == null || jti == null) return;
        long ttlMs = Duration.between(Instant.now(), expiresAt).toMillis();
        if (ttlMs <= 0) return;        // already expired — no need to publish
        try {
            redis.opsForValue().set(KEY_PREFIX + jti, "1", Duration.ofMillis(ttlMs));
            log.debug("Published revocation jti={} ttl={}ms", jti, ttlMs);
        } catch (Exception e) {
            log.warn("Redis revocation publish failed ({}). DB row still authoritative.",
                     e.getClass().getSimpleName());
        }
    }
}
