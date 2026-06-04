package com.college.payroll.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class PayrollResponse {
    private UUID id;
    private UUID employeeId;
    private String employeeName;
    private String empCode;
    private Integer month;
    private Integer year;
    private BigDecimal baseSalary;
    private BigDecimal allowances;
    private BigDecimal deductions;
    private BigDecimal leaveDeductions;
    private BigDecimal netSalary;
    private String status;
    private LocalDateTime processedAt;
    private String remarks;
    private LocalDateTime createdAt;
}
