package com.college.auth.service;

import com.college.auth.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Removes expired refresh tokens once per hour so the table does not grow unboundedly.
 * Tokens are also deleted on each login/refresh (rotation), so this is purely a safety net
 * for accounts that were deactivated or never logged in again.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenCleanupService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Scheduled(fixedRate = 3_600_000)   // every hour
    @Transactional
    public void purgeExpiredTokens() {
        int deleted = refreshTokenRepository.deleteAllExpiredBefore(LocalDateTime.now());
        if (deleted > 0) {
            log.info("Purged {} expired refresh token(s)", deleted);
        }
    }
}
