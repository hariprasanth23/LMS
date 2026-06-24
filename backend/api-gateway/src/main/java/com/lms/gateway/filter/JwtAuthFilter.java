package com.lms.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

/**
 * Validates the {@code lms_token} httpOnly cookie on every protected route.
 *
 * <p>If the JWT signature is valid, the issuer + audience match, the token
 * isn't a refresh token, and its {@code jti} is NOT on the Redis revocation
 * denylist, the gateway forwards the request downstream with:
 * <ul>
 *   <li>{@code X-User-Id}   — subject (UUID)</li>
 *   <li>{@code X-User-Role} — role claim</li>
 *   <li>{@code X-User-Name} — name claim</li>
 * </ul>
 *
 * <p>Public routes (login/register/refresh) are excluded by route definition,
 * not by an in-filter allow-list — so this filter never runs for them.
 */
@Slf4j
@Component
public class JwtAuthFilter extends AbstractGatewayFilterFactory<JwtAuthFilter.Config> {

    public static final String REVOCATION_KEY_PREFIX = "jwt:revoked:";

    @Value("${app.jwt.secret}")               private String jwtSecret;
    @Value("${app.jwt.issuer:lms-auth-service}")     private String issuer;
    @Value("${app.jwt.audience:lms-gateway}")        private String audience;
    @Value("${app.jwt.clock-skew-seconds:30}")       private long clockSkewSeconds;

    @Autowired(required = false)
    private ReactiveStringRedisTemplate redis;

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
        log.info("JwtAuthFilter initialised — iss='{}' aud='{}' skew={}s redis={}",
                 issuer, audience, clockSkewSeconds, redis != null);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest req = exchange.getRequest();

            var cookie = req.getCookies().getFirst("lms_token");
            String token = (cookie != null) ? cookie.getValue() : null;

            if (token == null || token.isBlank()) {
                String auth = req.getHeaders().getFirst("Authorization");
                if (auth != null && auth.startsWith("Bearer ")) {
                    token = auth.substring(7);
                }
            }

            if (token == null || token.isBlank()) {
                return unauthorized(exchange, "Missing authentication token");
            }

            final Claims claims;
            try {
                claims = Jwts.parser()
                        .verifyWith(signingKey)
                        .requireIssuer(issuer)
                        .requireAudience(audience)
                        .clockSkewSeconds(clockSkewSeconds)
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();
            } catch (JwtException e) {
                log.debug("JWT validation failed for {}: {}", req.getPath(), e.getMessage());
                return unauthorized(exchange, "Invalid or expired token");
            }

            if ("refresh".equals(claims.get("type", String.class))) {
                return unauthorized(exchange, "Refresh token cannot be used for API calls");
            }

            // Forward identity headers + check Redis revocation list (if Redis present)
            ServerHttpRequest mutated = req.mutate()
                    .header("X-User-Id",   claims.getSubject())
                    .header("X-User-Role", asStr(claims.get("role", String.class)))
                    .header("X-User-Name", asStr(claims.get("name", String.class)))
                    .build();
            ServerWebExchange next = exchange.mutate().request(mutated).build();

            String jti = claims.getId();
            if (redis == null || jti == null || jti.isBlank()) {
                return chain.filter(next);
            }
            return redis.hasKey(REVOCATION_KEY_PREFIX + jti)
                    .defaultIfEmpty(false)
                    .flatMap(revoked -> revoked
                            ? unauthorized(exchange, "Token has been revoked")
                            : chain.filter(next))
                    .onErrorResume(err -> {
                        log.warn("Redis revocation check failed ({}). Allowing request.",
                                 err.getClass().getSimpleName());
                        return chain.filter(next);
                    });
        };
    }

    private static String asStr(String v) { return v != null ? v : ""; }

    private Mono<Void> unauthorized(ServerWebExchange exchange, String msg) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        exchange.getResponse().getHeaders().add("X-Auth-Error", msg);
        return exchange.getResponse().setComplete();
    }

    public static class Config {}
}
