package com.college.employee.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class EmployeeResponse {
    private UUID id;
    private UUID userId;
    private String empCode;
    private String name;
    private String email;
    private String phone;
    private Long departmentId;
    private String designation;
    private String employeeType;
    private LocalDate joinDate;
    private BigDecimal baseSalary;
    private String status;
    private String qualifications;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
