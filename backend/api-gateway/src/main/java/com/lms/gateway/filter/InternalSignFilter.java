package com.lms.gateway.filter;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;

/**
 * Stamps every downstream request with a short-lived HMAC signature.
 *
 * <pre>
 *   X-Internal-Ts:    epoch-ms when the gateway signed
 *   X-Internal-Sig:   hex(HMAC-SHA256(secret, ts + ":" + path + ":" + userId))
 * </pre>
 *
 * <p>The downstream service's {@code InternalAuthFilter} (auth-service, every
 * stub service) refuses any request with a missing/invalid signature or a
 * timestamp older than the configured tolerance window. This stops a docker-
 * network attacker from forging {@code X-User-Id} headers and calling
 * authenticated endpoints directly.
 *
 * <p>Runs LAST so it sees the {@code X-User-Id} that {@code JwtAuthFilter}
 * injected.
 */
@Slf4j
@Component
public class InternalSignFilter implements GlobalFilter, Ordered {

    @Value("${app.internal.secret}")
    private String secret;

    private Mac mac;

    @PostConstruct
    void init() {
        if (secret == null || secret.length() < 32) {
            throw new IllegalStateException(
                "INTERNAL_SECRET must be at least 32 characters");
        }
        try {
            this.mac = Mac.getInstance("HmacSHA256");
            this.mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            log.info("InternalSignFilter initialised");
        } catch (Exception e) {
            throw new IllegalStateException("Failed to initialise HMAC", e);
        }
    }

    @Override
    public int getOrder() {
        // After JwtAuthFilter (which is route-specific). Spring Cloud Gateway
        // route filters end up between WRITE_RESPONSE_FILTER_ORDER and the
        // NettyRoutingFilter. We just need to run before Netty routes the
        // request to the upstream, so HIGHEST_PRECEDENCE here is wrong; pick
        // a number close to Ordered.LOWEST_PRECEDENCE - 10.
        return Ordered.LOWEST_PRECEDENCE - 10;
    }

    @Override
    public reactor.core.publisher.Mono<Void> filter(
            org.springframework.web.server.ServerWebExchange exchange,
            org.springframework.cloud.gateway.filter.GatewayFilterChain chain) {

        ServerHttpRequest req = exchange.getRequest();
        String userId = req.getHeaders().getFirst("X-User-Id");
        String ts = String.valueOf(System.currentTimeMillis());
        String path = req.getPath().value();
        String body = ts + ":" + path + ":" + (userId == null ? "" : userId);
        String sig;
        synchronized (mac) {     // Mac is not thread-safe
            sig = HexFormat.of().formatHex(mac.doFinal(body.getBytes(StandardCharsets.UTF_8)));
        }
        ServerHttpRequest mutated = req.mutate()
                .header("X-Internal-Ts",  ts)
                .header("X-Internal-Sig", sig)
                .build();
        return chain.filter(exchange.mutate().request(mutated).build());
    }
}
