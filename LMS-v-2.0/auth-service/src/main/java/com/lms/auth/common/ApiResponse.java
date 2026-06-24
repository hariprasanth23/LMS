package com.lms.auth.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;

import java.time.Instant;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private final boolean success;
    private final String  message;
    /** Machine-readable {@link ErrorCode}.name() — present on error responses. */
    private final String  code;
    private final T       data;
    private final Instant timestamp = Instant.now();

    private ApiResponse(boolean success, String message, String code, T data) {
        this.success = success;
        this.message = message;
        this.code    = code;
        this.data    = data;
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, null, data);
    }

    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message, null, null);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, ErrorCode.INTERNAL_ERROR.name(), null);
    }

    public static <T> ApiResponse<T> error(String message, T data) {
        return new ApiResponse<>(false, message, ErrorCode.INTERNAL_ERROR.name(), data);
    }

    public static <T> ApiResponse<T> error(ErrorCode code, String message) {
        return new ApiResponse<>(false, message, code.name(), null);
    }

    public static <T> ApiResponse<T> error(ErrorCode code, String message, T data) {
        return new ApiResponse<>(false, message, code.name(), data);
    }
}
