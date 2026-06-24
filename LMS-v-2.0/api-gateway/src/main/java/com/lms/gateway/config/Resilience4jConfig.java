package com.lms.gateway.config;

import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.timelimiter.TimeLimiterConfig;
import org.springframework.cloud.circuitbreaker.resilience4j.ReactiveResilience4JCircuitBreakerFactory;
import org.springframework.cloud.circuitbreaker.resilience4j.Resilience4JConfigBuilder;
import org.springframework.cloud.client.circuitbreaker.Customizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

/**
 * Per-route circuit breaker tuning.
 *
 * <ul>
 *   <li><b>default</b>  — 50% failure threshold over 20 calls, 30s open state,
 *                         3s call timeout. Used by every route unless one
 *                         below claims it.</li>
 *   <li><b>finance</b>  — stricter: 20% failure threshold, 60s open, 2s timeout.
 *                         Money endpoints should fail FAST rather than retry
 *                         a flaky downstream.</li>
 *   <li><b>auth</b>     — lenient: 80% threshold, 10s open, 5s timeout. Auth
 *                         is on the critical path; transient failures shouldn't
 *                         lock the whole site out of login.</li>
 * </ul>
 */
@Configuration
public class Resilience4jConfig {

    @Bean
    public Customizer<ReactiveResilience4JCircuitBreakerFactory> defaultCustomizer() {
        return factory -> {
            factory.configureDefault(id -> new Resilience4JConfigBuilder(id)
                    .circuitBreakerConfig(CircuitBreakerConfig.custom()
                            .slidingWindowSize(20)
                            .failureRateThreshold(50)
                            .waitDurationInOpenState(Duration.ofSeconds(30))
                            .permittedNumberOfCallsInHalfOpenState(3)
                            .minimumNumberOfCalls(5)
                            .build())
                    .timeLimiterConfig(TimeLimiterConfig.custom()
                            .timeoutDuration(Duration.ofSeconds(3))
                            .build())
                    .build());

            factory.configure(b -> b
                    .circuitBreakerConfig(CircuitBreakerConfig.custom()
                            .slidingWindowSize(10)
                            .failureRateThreshold(20)
                            .waitDurationInOpenState(Duration.ofSeconds(60))
                            .minimumNumberOfCalls(3)
                            .build())
                    .timeLimiterConfig(TimeLimiterConfig.custom()
                            .timeoutDuration(Duration.ofSeconds(2))
                            .build()),
                "cbFinance");

            factory.configure(b -> b
                    .circuitBreakerConfig(CircuitBreakerConfig.custom()
                            .slidingWindowSize(30)
                            .failureRateThreshold(80)
                            .waitDurationInOpenState(Duration.ofSeconds(10))
                            .minimumNumberOfCalls(10)
                            .build())
                    .timeLimiterConfig(TimeLimiterConfig.custom()
                            .timeoutDuration(Duration.ofSeconds(5))
                            .build()),
                "cbAuth");
        };
    }
}
