package com.lms.auth.service;

import com.lms.auth.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenCleanupService {

    private final RefreshTokenRepository refreshTokenRepository;

    /** Runs hourly. Drops every refresh-token row whose expiry has passed. */
    @Scheduled(fixedRateString = "${app.cleanup.refresh-tokens-ms:3600000}")
    @Transactional
    public void purge() {
        int deleted = refreshTokenRepository.deleteAllExpired(Instant.now());
        if (deleted > 0) log.info("Purged {} expired refresh tokens", deleted);
    }
}
