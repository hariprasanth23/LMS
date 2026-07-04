package com.lms.auth.common;

/**
 * Machine-readable error tag attached to every error response so clients can
 * branch on it without parsing the human-readable {@code message} field.
 *
 * <p>Names follow the pattern {@code <DOMAIN>_<CONDITION>} — keep them stable
 * once published; the frontend can hard-code on them. Add new values rather
 * than renaming.
 */
public enum ErrorCode {

    /* generic / cross-cutting */
    VALIDATION_FAILED,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    CONFLICT,
    RATE_LIMITED,
    INTERNAL_ERROR,

    /* auth-service specific */
    AUTH_BAD_CREDENTIALS,
    AUTH_ACCOUNT_DEACTIVATED,
    AUTH_TOKEN_INVALID,
    AUTH_TOKEN_EXPIRED,
    AUTH_TOKEN_REVOKED,
    AUTH_EMAIL_TAKEN,
    AUTH_PASSWORD_WEAK
}
