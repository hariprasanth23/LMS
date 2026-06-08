package com.college.employee.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class EmployeeImportRow {
    private String empCode;
    private String name;
    private String email;
    private String phone;
    private Long departmentId;
    private String designation;
    private String employeeType;
    private LocalDate joinDate;
    private BigDecimal baseSalary;
    private String qualifications;
    private String status;
}
