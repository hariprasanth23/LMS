package com.college.common.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * Fails fast at startup if any required environment variable is absent or obviously weak.
 * Prevents the application from starting in a broken/insecure configuration.
 */
@Configuration
@Profile("!test")
public class EnvValidator {

    private static final Logger log = LoggerFactory.getLogger(EnvValidator.class);

    @Value("${spring.datasource.url:}") private String dbUrl;
    @Value("${spring.datasource.username:}") private String dbUser;
    @Value("${spring.datasource.password:}") private String dbPassword;
    @Value("${app.jwt.secret:}") private String jwtSecret;
    @Value("${app.frontend.url:}") private String frontendUrl;

    @PostConstruct
    public void validate() {
        boolean ok = true;
        ok &= require("DB_URL / spring.datasource.url",      dbUrl);
        ok &= require("DB_USERNAME / spring.datasource.username", dbUser);
        ok &= require("DB_PASSWORD / spring.datasource.password", dbPassword);
        ok &= require("JWT_SECRET / app.jwt.secret",         jwtSecret);
        ok &= require("APP_FRONTEND_URL / app.frontend.url", frontendUrl);

        if (jwtSecret != null && jwtSecret.length() < 32) {
            log.error("STARTUP VALIDATION FAILED — JWT_SECRET must be at least 32 characters (got {})", jwtSecret.length());
            ok = false;
        }

        if (!ok) {
            throw new IllegalStateException(
                "Application startup aborted: one or more required environment variables are missing or invalid. " +
                "Check logs above for details.");
        }

        log.info("Environment validation passed.");
    }

    private boolean require(String name, String value) {
        if (value == null || value.isBlank()) {
            log.error("STARTUP VALIDATION FAILED — required variable is not set: {}", name);
            return false;
        }
        return true;
    }
}
