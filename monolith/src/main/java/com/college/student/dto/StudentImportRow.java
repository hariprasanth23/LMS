package com.college.student.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentImportRow {

    @NotBlank(message = "Name is required")
    @Size(max = 150, message = "Name must not exceed 150 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 150)
    private String email;

    @Size(max = 20)
    private String phone;

    @NotBlank(message = "Roll number is required")
    @Size(max = 20)
    private String rollNumber;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @NotNull(message = "Semester is required")
    @Min(value = 1, message = "Semester must be between 1 and 8")
    @Max(value = 8, message = "Semester must be between 1 and 8")
    private Integer semester;

    @Size(max = 20)
    private String batch;

    private LocalDate joinDate;

    @Size(max = 20)
    private String status;

    @Size(max = 150)
    private String guardianName;

    @Size(max = 20)
    private String guardianPhone;

    private String address;
}
