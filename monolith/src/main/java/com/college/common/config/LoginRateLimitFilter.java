package com.college.common.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Blocks login brute-force by tracking failed POST /api/auth/login attempts per client IP.
 * After MAX_ATTEMPTS failures within WINDOW_MS the IP is locked out for the same window.
 * The counter resets automatically once the window expires.
 */
@Slf4j
@Component
@Order(2)
public class LoginRateLimitFilter implements Filter {

    private static final int  MAX_ATTEMPTS = 5;
    private static final long WINDOW_MS    = 15 * 60 * 1000L;  // 15 minutes

    private static final Set<String> RATE_LIMITED_PATHS = Set.of(
            "/api/auth/login",
            "/api/auth/refresh"
    );

    private record Bucket(AtomicInteger count, long windowStart) {}

    private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest  req  = (HttpServletRequest)  request;
        HttpServletResponse resp = (HttpServletResponse) response;

        String uri = req.getRequestURI();
        if (!"POST".equalsIgnoreCase(req.getMethod()) || !RATE_LIMITED_PATHS.contains(uri)) {
            chain.doFilter(request, response);
            return;
        }

        String ip = resolveClientIp(req);
        Bucket bucket = getOrCreateBucket(ip);

        if (bucket.count().get() >= MAX_ATTEMPTS) {
            log.warn("Rate limit exceeded for IP {} on {}", ip, uri);
            resp.setStatus(429); // 429 Too Many Requests
            resp.setContentType(MediaType.APPLICATION_JSON_VALUE);
            // Map.of() forbids null values; use a mutable map for the null "data" field
            java.util.LinkedHashMap<String, Object> body = new java.util.LinkedHashMap<>();
            body.put("success", false);
            body.put("message", "Too many login attempts. Try again in 15 minutes.");
            body.put("data", null);
            objectMapper.writeValue(resp.getWriter(), body);
            return;
        }

        // Wrap response to detect 401 (bad credentials) and increment counter
        StatusCapturingResponseWrapper wrapper = new StatusCapturingResponseWrapper(resp);
        chain.doFilter(request, wrapper);

        if (wrapper.getStatus() == HttpServletResponse.SC_UNAUTHORIZED
                || wrapper.getStatus() == HttpServletResponse.SC_BAD_REQUEST) {
            int attempts = bucket.count().incrementAndGet();
            log.debug("Failed login attempt {}/{} from IP {}", attempts, MAX_ATTEMPTS, ip);
        } else {
            // Successful login clears the counter
            buckets.remove(ip);
        }
    }

    private Bucket getOrCreateBucket(String ip) {
        long now = Instant.now().toEpochMilli();
        // compute() is atomic per-key: no two threads can race to create a fresh bucket
        return buckets.compute(ip, (key, existing) -> {
            if (existing == null || (now - existing.windowStart()) > WINDOW_MS) {
                return new Bucket(new AtomicInteger(0), now);
            }
            return existing;
        });
    }

    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].strip();
        }
        return request.getRemoteAddr();
    }

    // ── Minimal response wrapper to capture the written status ───────────────

    private static class StatusCapturingResponseWrapper extends jakarta.servlet.http.HttpServletResponseWrapper {
        private int status = HttpServletResponse.SC_OK;

        StatusCapturingResponseWrapper(HttpServletResponse response) {
            super(response);
        }

        @Override public void setStatus(int sc) { this.status = sc; super.setStatus(sc); }
        @Override public void sendError(int sc)           throws IOException { this.status = sc; super.sendError(sc); }
        @Override public void sendError(int sc, String m) throws IOException { this.status = sc; super.sendError(sc, m); }

        @Override public int getStatus() { return status; }
    }
}
