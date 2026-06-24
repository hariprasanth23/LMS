package com.lms.auth.service;

import com.lms.auth.dto.*;

public interface AuthService {

    LoginResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    LoginResponse refresh(String refreshToken);

    /**
     * @param refreshToken cookie value (null/blank tolerated — best-effort delete)
     * @param accessToken  current access JWT — added to the revocation list so
     *                     it can no longer be used until natural expiry
     */
    void logout(String refreshToken, String accessToken);

    UserDto getProfile(String userId);

    UserDto updateProfile(String userId, UpdateProfileRequest request);

    /**
     * @param userId      caller (from X-User-Id)
     * @param accessToken caller's current JWT — added to the revocation list
     *                    along with every other refresh token for this user.
     *                    After change, all sessions everywhere are dead.
     */
    void changePassword(String userId, ChangePasswordRequest request, String accessToken);
}
