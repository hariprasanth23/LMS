package com.lms.auth.dto;

import com.lms.auth.model.User;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 150)
    private String name;

    @NotBlank(message = "Email is required")
    @Email
    private String email;

    @Pattern(regexp = "^[0-9+\\-\\s]{7,20}$", message = "Invalid phone number")
    private String phone;

    @NotBlank(message = "Password is required")
    private String password;

    /**
     * Optional. Public registration ignores this — the service always creates
     * STUDENT for anonymous callers. Only requests carrying an authenticated
     * ADMIN JWT (validated at the gateway) may pass ADMIN / FACULTY / STAFF /
     * PARENT. See {@link com.lms.auth.service.impl.AuthServiceImpl}.
     */
    private User.Role role;
}
