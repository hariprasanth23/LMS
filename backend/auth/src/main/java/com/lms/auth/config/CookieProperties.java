package com.lms.auth.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.cookie")
@Getter
@Setter
public class CookieProperties {

    /** Sets the {@code Secure} attribute. MUST be true in production (HTTPS). */
    private boolean secure = false;

    /** Strict / Lax / None. Default Lax — survives external link follows. */
    private String sameSite = "Lax";

    /** Optional domain (e.g. {@code .lms.yourdomain.com}). Null = host-only. */
    private String domain;

    /** Access-token cookie lifetime in milliseconds. */
    private long maxAgeMs = 24 * 60 * 60 * 1000L;
}
