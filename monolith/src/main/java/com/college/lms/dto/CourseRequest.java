package com.college.lms.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.UUID;

@Data
public class CourseRequest {

    @NotBlank(message = "Code is required")
    @Size(max = 20)
    private String code;

    @NotBlank(message = "Name is required")
    @Size(max = 200)
    private String name;

    private String description;

    private Long departmentId;

    @Min(1)
    private Integer credits;

    @Min(1) @Max(8)
    private Integer semester;

    private UUID facultyId;

    @Pattern(regexp = "ACTIVE|INACTIVE|ARCHIVED", message = "Invalid status")
    private String status;
}
