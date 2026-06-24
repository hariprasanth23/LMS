package com.lms.auth.exception;

import com.lms.auth.common.ApiResponse;
import com.lms.auth.common.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidation(
            MethodArgumentNotValidException ex, HttpServletRequest req) {
        Map<String, String> errors = new LinkedHashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            errors.put(fe.getField(), fe.getDefaultMessage());
        }
        log.warn("Validation failed at {}: {}", req.getRequestURI(), errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ErrorCode.VALIDATION_FAILED, "Validation failed", errors));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(ErrorCode.AUTH_BAD_CREDENTIALS, ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadRequest(IllegalArgumentException ex) {
        ErrorCode code = ex.getMessage() != null && ex.getMessage().toLowerCase().contains("password")
                ? ErrorCode.AUTH_PASSWORD_WEAK
                : ErrorCode.VALIDATION_FAILED;
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(code, ex.getMessage()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiResponse<Void>> handleConflict(IllegalStateException ex) {
        ErrorCode code = ex.getMessage() != null && ex.getMessage().toLowerCase().contains("already")
                ? ErrorCode.AUTH_EMAIL_TAKEN
                : ex.getMessage() != null && ex.getMessage().toLowerCase().contains("deactivated")
                ? ErrorCode.AUTH_ACCOUNT_DEACTIVATED
                : ErrorCode.CONFLICT;
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(code, ex.getMessage()));
    }

    @ExceptionHandler(MissingRequestHeaderException.class)
    public ResponseEntity<ApiResponse<Void>> handleMissingHeader(MissingRequestHeaderException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(ErrorCode.UNAUTHORIZED,
                                        "Missing required header: " + ex.getHeaderName()));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Void>> handleStatus(ResponseStatusException ex) {
        ErrorCode code = ex.getStatusCode() == HttpStatus.FORBIDDEN ? ErrorCode.FORBIDDEN
                : ex.getStatusCode() == HttpStatus.UNAUTHORIZED ? ErrorCode.UNAUTHORIZED
                : ex.getStatusCode() == HttpStatus.NOT_FOUND ? ErrorCode.NOT_FOUND
                : ErrorCode.INTERNAL_ERROR;
        return ResponseEntity.status(ex.getStatusCode())
                .body(ApiResponse.error(code, ex.getReason()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleAny(Exception ex, HttpServletRequest req) {
        // Log type-name only at WARN. The stack trace goes to DEBUG so production
        // logs don't ingest user-provided strings (JPA exceptions include bound
        // parameter values, which can be PII).
        log.warn("Unhandled {} at {}", ex.getClass().getSimpleName(), req.getRequestURI());
        log.debug("Stack:", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(ErrorCode.INTERNAL_ERROR, "An unexpected error occurred"));
    }
}
