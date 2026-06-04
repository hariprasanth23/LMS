package com.college.auth.service;

import com.college.auth.dto.request.LoginRequest;
import com.college.auth.dto.request.RegisterRequest;
import com.college.auth.dto.response.AuthResponse;

public interface AuthService {

    /**
     * Register a new user. Throws {@link IllegalStateException} if the email is already in use.
     * Password must satisfy strength requirements (min 8 chars, upper, lower, digit, special).
     */
    AuthResponse register(RegisterRequest request);

    /**
     * Authenticate by email OR phone. Returns tokens on success.
     */
    AuthResponse login(LoginRequest request);
}
