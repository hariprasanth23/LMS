package com.lms.auth.config;

import net.javacrumbs.shedlock.provider.jdbctemplate.JdbcTemplateLockProvider;
import net.javacrumbs.shedlock.spring.annotation.EnableSchedulerLock;
import net.javacrumbs.shedlock.support.LockProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;

import javax.sql.DataSource;

/**
 * Wires up {@code @Scheduled} + ShedLock — but only outside the {@code test}
 * profile, so unit tests don't fire hourly cleanup jobs against the test DB.
 *
 * <p>ShedLock takes a row in the {@code shedlock} table (PostgreSQL FOR UPDATE)
 * before allowing the scheduled method to execute. With multiple auth-service
 * replicas, only one runs each tick — the others quietly skip.
 */
@Configuration
@Profile("!test")
@EnableScheduling
@EnableSchedulerLock(defaultLockAtMostFor = "10m")
public class SchedulingConfig {

    @Bean
    public LockProvider lockProvider(DataSource dataSource) {
        return new JdbcTemplateLockProvider(
                JdbcTemplateLockProvider.Configuration.builder()
                        .withJdbcTemplate(new JdbcTemplate(dataSource))
                        .usingDbTime()                 // PostgreSQL clock, not the JVM's
                        .build());
    }
}
