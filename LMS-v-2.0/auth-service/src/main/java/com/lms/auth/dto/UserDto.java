package com.lms.auth.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDto {
    private final UUID   id;
    private final String name;
    private final String email;
    private final String phone;
    private final String role;
    private final String profilePhoto;
    private final boolean active;
}
