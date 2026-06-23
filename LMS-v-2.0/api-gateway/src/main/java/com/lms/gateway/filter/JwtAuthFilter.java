package com.lms.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

/**
 * Validates the {@code lms_token} httpOnly cookie on every protected route.
 *
 * <p>If valid, the JWT's claims are extracted and forwarded downstream as
 * {@code X-User-Id}, {@code X-User-Role}, {@code X-User-Name} headers. The
 * downstream services trust these headers and never re-parse the JWT.
 *
 * <p>Public routes (login/register/refresh) are excluded by route definition,
 * not by an in-filter allow-list — so this filter never runs for them.
 */
@Slf4j
@Component
public class JwtAuthFilter extends AbstractGatewayFilterFactory<JwtAuthFilter.Config> {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    private SecretKey signingKey;

    public JwtAuthFilter() { super(Config.class); }

    @PostConstruct
    void init() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalStateException(
                "JWT_SECRET must be at least 32 bytes (256 bits) — got " + keyBytes.length);
        }
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        log.info("JwtAuthFilter initialised");
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest req = exchange.getRequest();

            var cookie = req.getCookies().getFirst("lms_token");
            String token = (cookie != null) ? cookie.getValue() : null;

            // Fallback: Authorization: Bearer … (for non-browser clients / tests)
            if (token == null || token.isBlank()) {
                String auth = req.getHeaders().getFirst("Authorization");
                if (auth != null && auth.startsWith("Bearer ")) {
                    token = auth.substring(7);
                }
            }

            if (token == null || token.isBlank()) {
                return unauthorized(exchange, "Missing authentication token");
            }

            try {
                Claims claims = Jwts.parser()
                        .verifyWith(signingKey)
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

                // Reject if this is a refresh token (those are for /auth/refresh only)
                if ("refresh".equals(claims.get("type", String.class))) {
                    return unauthorized(exchange, "Refresh token cannot be used for API calls");
                }

                String role = claims.get("role", String.class);
                String name = claims.get("name", String.class);

                ServerHttpRequest mutated = req.mutate()
                        .header("X-User-Id",   claims.getSubject())
                        .header("X-User-Role", role != null ? role : "")
                        .header("X-User-Name", name != null ? name : "")
                        .build();

                return chain.filter(exchange.mutate().request(mutated).build());

            } catch (JwtException e) {
                log.debug("JWT validation failed for {}: {}", req.getPath(), e.getMessage());
                return unauthorized(exchange, "Invalid or expired token");
            }
        };
    }

    private reactor.core.publisher.Mono<Void> unauthorized(
            org.springframework.web.server.ServerWebExchange exchange, String msg) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        exchange.getResponse().getHeaders().add("X-Auth-Error", msg);
        return exchange.getResponse().setComplete();
    }

    public static class Config {}
}
