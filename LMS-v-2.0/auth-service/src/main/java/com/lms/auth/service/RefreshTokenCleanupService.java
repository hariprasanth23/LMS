package com.lms.auth.service;

import com.lms.auth.repository.RefreshTokenRepository;
import com.lms.auth.repository.RevokedTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

/**
 * Hourly cleanup of expired auth artefacts:
 * <ul>
 *   <li>{@code refresh_tokens}  — past-expiry refresh tokens</li>
 *   <li>{@code revoked_tokens}  — past-expiry denylist entries (the underlying
 *       JWT can't be presented any more anyway, so the row is useless)</li>
 * </ul>
 *
 * <p>Redis revocation entries self-expire via TTL — no sweep needed there.
 *
 * <p>{@link SchedulerLock} ensures only one replica per cluster runs each
 * cleanup tick, even if you scale auth-service horizontally.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenCleanupService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final RevokedTokenRepository revokedTokenRepository;

    @Scheduled(fixedRateString = "${app.cleanup.refresh-tokens-ms:3600000}")
    @SchedulerLock(name = "purgeRefreshTokens", lockAtMostFor = "5m", lockAtLeastFor = "30s")
    @Transactional
    public void purgeRefresh() {
        int deleted = refreshTokenRepository.deleteAllExpired(Instant.now());
        if (deleted > 0) log.info("Purged {} expired refresh tokens", deleted);
    }

    @Scheduled(fixedRateString = "${app.cleanup.revoked-tokens-ms:3600000}")
    @SchedulerLock(name = "purgeRevocations", lockAtMostFor = "5m", lockAtLeastFor = "30s")
    @Transactional
    public void purgeRevocations() {
        int deleted = revokedTokenRepository.deleteAllExpired(Instant.now());
        if (deleted > 0) log.info("Purged {} expired revocation rows", deleted);
    }
}
