package com.lms.auth.security;

import com.lms.auth.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
public class JwtUtil {

    private final SecretKey signingKey;
    private final long  accessValidityMs;
    private final long  refreshValidityMs;
    private final String issuer;
    private final String audience;
    private final long  clockSkewSeconds;

    public JwtUtil(
            @Value("${app.jwt.secret}")                          String secret,
            @Value("${app.jwt.expiration-ms:86400000}")          long accessValidityMs,
            @Value("${app.jwt.refresh-expiration-ms:604800000}") long refreshValidityMs,
            @Value("${app.jwt.issuer:lms-auth-service}")         String issuer,
            @Value("${app.jwt.audience:lms-gateway}")            String audience,
            @Value("${app.jwt.clock-skew-seconds:30}")           long clockSkewSeconds) {

        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalStateException(
                "JWT_SECRET must be at least 32 bytes (256 bits) — got " + keyBytes.length);
        }
        this.signingKey        = Keys.hmacShaKeyFor(keyBytes);
        this.accessValidityMs  = accessValidityMs;
        this.refreshValidityMs = refreshValidityMs;
        this.issuer            = issuer;
        this.audience          = audience;
        this.clockSkewSeconds  = clockSkewSeconds;
        log.info("JwtUtil ready — issuer='{}' aud='{}' access={}ms refresh={}ms skew={}s",
                 issuer, audience, accessValidityMs, refreshValidityMs, clockSkewSeconds);
    }

    public String generateAccessToken(User user) {
        return build(user, accessValidityMs, Map.of(
                "role", user.getRole().name(),
                "name", user.getName(),
                "type", "access"));
    }

    public String generateRefreshToken(User user) {
        return build(user, refreshValidityMs, Map.of("type", "refresh"));
    }

    /**
     * Parse + validate. Throws {@link JwtException} on bad signature,
     * expired token, wrong issuer / audience, or clock skew beyond tolerance.
     */
    public Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .requireIssuer(issuer)
                .requireAudience(audience)
                .clockSkewSeconds(clockSkewSeconds)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private String build(User user, long validityMs, Map<String, Object> claims) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .claims(claims)
                .id(UUID.randomUUID().toString())                 // jti — needed for revocation
                .subject(user.getId().toString())
                .issuer(issuer)
                .audience().add(audience).and()
                .issuedAt(new Date(now))
                .expiration(new Date(now + validityMs))
                .signWith(signingKey)
                .compact();
    }

    public long   getAccessValidityMs()  { return accessValidityMs; }
    public long   getRefreshValidityMs() { return refreshValidityMs; }
    public String getIssuer()            { return issuer; }
    public String getAudience()          { return audience; }
}
