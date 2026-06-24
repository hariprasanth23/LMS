package com.lms.gateway.filter;

import org.slf4j.MDC;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.UUID;

/**
 * Reads or mints {@code X-Correlation-Id}. Echoes it back on the response and
 * forwards it downstream so every log line in the call chain can be joined.
 *
 * <p>Runs at HIGHEST_PRECEDENCE so even rate-limiter rejections include the
 * correlation header in the response.
 */
@Component
public class CorrelationIdFilter implements GlobalFilter, Ordered {

    public static final String HEADER = "X-Correlation-Id";

    @Override
    public int getOrder() { return Ordered.HIGHEST_PRECEDENCE; }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest req = exchange.getRequest();
        String cid = req.getHeaders().getFirst(HEADER);
        if (cid == null || cid.isBlank()) cid = UUID.randomUUID().toString();
        final String cidFinal = cid;

        ServerHttpRequest mutated = req.mutate().header(HEADER, cidFinal).build();
        exchange.getResponse().getHeaders().add(HEADER, cidFinal);

        MDC.put("correlationId", cidFinal);
        return chain.filter(exchange.mutate().request(mutated).build())
                .doFinally(sig -> MDC.remove("correlationId"));
    }
}
