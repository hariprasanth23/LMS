package com.lms.auth.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LoginResponse {
    private final String accessToken;
    private final String refreshToken;
    private final long   expiresInSeconds;
    private final UserDto user;
}
