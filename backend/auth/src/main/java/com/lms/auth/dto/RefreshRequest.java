package com.lms.auth.dto;

import lombok.Data;

@Data
public class RefreshRequest {
    private String refreshToken;   // optional — gateway also reads it from cookie
}
