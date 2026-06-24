package com.lms.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DepartmentRequest {
    @NotBlank private String name;
    @NotBlank @Size(max = 20) private String code;
    private String description;
    private String email;
    private String phone;
    private String location;
    private Integer establishedYear;
    private Integer totalSeats;
}
