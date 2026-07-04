package com.lms.feedback.security;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;
import java.util.Set;

/**
 * Rejects any request that didn't arrive via the api-gateway.
 * See auth-service InternalAuthFilter for full details.
 */
@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 10)
public class InternalAuthFilter implements Filter {

    private static final Set<String> SKIP_PREFIXES = Set.of("/actuator", "/api/_health");

    @Value("${app.internal.secret}")        private String secret;
    @Value("${app.internal.enforce:true}")  private boolean enforce;
    @Value("${app.internal.max-age-seconds:60}") private long maxAgeSeconds;

    private Mac mac;

    @PostConstruct
    void init() {
        if (!enforce) {
            log.warn("InternalAuthFilter: ENFORCE=false — gateway signature NOT checked");
            return;
        }
        if (secret == null || secret.length() < 32) {
            throw new IllegalStateException("INTERNAL_SECRET must be at least 32 characters");
        }
        try {
            this.mac = Mac.getInstance("HmacSHA256");
            this.mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            log.info("InternalAuthFilter active — max-age={}s", maxAgeSeconds);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to initialise HMAC", e);
        }
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest  req  = (HttpServletRequest)  request;
        HttpServletResponse resp = (HttpServletResponse) response;
        String path = req.getRequestURI();
        if (!enforce || skip(path)) { chain.doFilter(request, response); return; }

        String ts  = req.getHeader("X-Internal-Ts");
        String sig = req.getHeader("X-Internal-Sig");
        String uid = req.getHeader("X-User-Id");
        if (ts == null || sig == null) { reject(resp, "Missing internal signature headers"); return; }

        long sentAt;
        try { sentAt = Long.parseLong(ts); }
        catch (NumberFormatException e) { reject(resp, "Bad X-Internal-Ts"); return; }
        long ageSec = Math.abs(System.currentTimeMillis() - sentAt) / 1000L;
        if (ageSec > maxAgeSeconds) { reject(resp, "Internal signature expired (age=" + ageSec + "s)"); return; }

        String body = ts + ":" + path + ":" + (uid == null ? "" : uid);
        byte[] expected;
        synchronized (mac) { expected = mac.doFinal(body.getBytes(StandardCharsets.UTF_8)); }
        if (!constantTimeEquals(sig, HexFormat.of().formatHex(expected))) {
            reject(resp, "Bad internal signature"); return;
        }
        chain.doFilter(request, response);
    }

    private static boolean skip(String path) {
        for (String p : SKIP_PREFIXES) if (path.startsWith(p)) return true;
        return false;
    }
    private static void reject(HttpServletResponse resp, String why) throws IOException {
        resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
        resp.setContentType(MediaType.APPLICATION_JSON_VALUE);
        resp.getWriter().write("{\"success\":false,\"message\":\"" + why + "\"}");
    }
    private static boolean constantTimeEquals(String a, String b) {
        if (a == null || b == null || a.length() != b.length()) return false;
        int r = 0;
        for (int i = 0; i < a.length(); i++) r |= a.charAt(i) ^ b.charAt(i);
        return r == 0;
    }
}
