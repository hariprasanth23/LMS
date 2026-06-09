package com.college.student.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.UUID;

@Data
public class DepartmentRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100)
    private String name;

    @NotBlank(message = "Code is required")
    @Size(max = 10)
    private String code;

    private String description;

    private UUID headFacultyId;

    @jakarta.validation.constraints.Email(message = "Invalid email address")
    @Size(max = 100)
    private String email;

    @Size(max = 20)
    private String phone;

    @Size(max = 200)
    private String location;

    private Integer establishedYear;

    private Integer totalSeats;
}
