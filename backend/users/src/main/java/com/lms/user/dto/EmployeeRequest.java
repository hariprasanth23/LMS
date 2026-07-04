package com.lms.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class EmployeeRequest {
    @NotNull  private UUID userId;
    @NotBlank private String empCode;
    @NotBlank private String name;
    @Email @NotBlank private String email;
    private String phone;
    @NotNull  private Long departmentId;
    private String designation;
    @NotBlank @Pattern(regexp = "FACULTY|STAFF", message = "employeeType must be FACULTY or STAFF")
    private String employeeType;
    private LocalDate joinDate;
    private BigDecimal baseSalary;
    private String qualifications;
}
