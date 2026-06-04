package com.college.employee.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class EmployeeRequest {

    private UUID userId;

    @NotBlank(message = "Employee code is required")
    private String empCode;

    @NotBlank(message = "Name is required")
    private String name;

    private String email;
    private String phone;
    private Long departmentId;
    private String designation;

    @NotBlank(message = "Employee type is required")
    private String employeeType;

    private LocalDate joinDate;
    private BigDecimal baseSalary;
    private String qualifications;
}
