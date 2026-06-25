package com.lms.gateway.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

/**
 * Rate-limit key resolvers.
 *
 * <ul>
 *   <li>{@code ipKeyResolver} — for unauthenticated traffic (login bursts).</li>
 *   <li>{@code userKeyResolver} — for authenticated traffic. Falls back to IP
 *       so a request that hasn't been through JwtAuthFilter yet (or arrived
 *       without a cookie) is still bucketed.</li>
 * </ul>
 */
@Slf4j
@Configuration
public class RateLimitConfig {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    private SecretKey signingKey;

    @PostConstruct
    void init() {
        this.signingKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    @Bean
    public KeyResolver ipKeyResolver() {
        return exchange -> {
            var addr = exchange.getRequest().getRemoteAddress();
            String ip = (addr != null) ? addr.getAddress().getHostAddress() : "unknown";
            return Mono.just("ip:" + ip);
        };
    }

    @Bean
    @Primary
    public KeyResolver userKeyResolver() {
        return exchange -> {
            var cookie = exchange.getRequest().getCookies().getFirst("lms_token");
            if (cookie != null) {
                try {
                    Claims claims = Jwts.parser()
                            .verifyWith(signingKey)
                            .build()
                            .parseSignedClaims(cookie.getValue())
                            .getPayload();
                    String sub = claims.getSubject();
                    if (sub != null && !sub.isBlank()) return Mono.just("user:" + sub);
                } catch (Exception ignored) {
                    // fall through to IP bucket on invalid token
                }
            }
            var addr = exchange.getRequest().getRemoteAddress();
            String ip = (addr != null) ? addr.getAddress().getHostAddress() : "unknown";
            return Mono.just("ip:" + ip);
        };
    }
}
