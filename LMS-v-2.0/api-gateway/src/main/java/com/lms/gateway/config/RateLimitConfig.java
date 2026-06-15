package com.lms.gateway.config;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

@Configuration
public class RateLimitConfig {

    @Bean
    public KeyResolver ipKeyResolver() {
        return exchange -> {
            var address = exchange.getRequest().getRemoteAddress();
            return Mono.just(address != null ? address.getAddress().getHostAddress() : "unknown");
        };
    }
}
