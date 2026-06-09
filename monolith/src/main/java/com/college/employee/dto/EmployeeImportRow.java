package com.college.employee.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class EmployeeImportRow {

    @NotBlank(message = "Employee code is required")
    @Size(max = 20)
    private String empCode;

    @NotBlank(message = "Name is required")
    @Size(max = 150)
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 150)
    private String email;

    @Size(max = 20)
    private String phone;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @Size(max = 100)
    private String designation;

    @Size(max = 20)
    private String employeeType;

    private LocalDate joinDate;

    @DecimalMin(value = "0.0", inclusive = false, message = "Base salary must be positive")
    private BigDecimal baseSalary;

    private String qualifications;

    @Size(max = 20)
    private String status;
}
