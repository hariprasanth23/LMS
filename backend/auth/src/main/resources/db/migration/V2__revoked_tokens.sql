-- ─────────────────────────────────────────────────────────────────────────────
-- V2 — JWT revocation list (denylist) for access-token logout / password change
--
-- Spring Security's JwtAuthFilter checks this table on every protected request.
-- Rows are cleaned up automatically once their `expires_at` passes — keeping the
-- table from growing unbounded.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE revoked_tokens (
    jti         TEXT        PRIMARY KEY,         -- JWT id claim
    user_id     UUID        NOT NULL,
    revoked_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at  TIMESTAMPTZ NOT NULL,            -- = original JWT exp
    reason      VARCHAR(40) NOT NULL DEFAULT 'logout'
);

CREATE INDEX idx_revoked_tokens_expires_at ON revoked_tokens(expires_at);
CREATE INDEX idx_revoked_tokens_user_id    ON revoked_tokens(user_id);
