package com.college.student.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class StudentRequest {

    @NotNull(message = "userId is required")
    private UUID userId;

    @NotBlank(message = "Roll number is required")
    @Size(max = 20)
    private String rollNumber;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @Min(1) @Max(8)
    private Integer semester;

    @Size(max = 10)
    private String batch;

    private LocalDate joinDate;

    @Pattern(regexp = "ACTIVE|INACTIVE|GRADUATED|DROPPED", message = "Invalid status")
    private String status;

    @Size(max = 100)
    private String guardianName;

    @Size(max = 20)
    private String guardianPhone;

    private String address;
}
