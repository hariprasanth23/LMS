package com.college.payroll.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PayrollGenerateRequest {

    @NotNull(message = "Month is required")
    @Min(value = 1, message = "Month must be between 1 and 12")
    @Max(value = 12, message = "Month must be between 1 and 12")
    private Integer month;

    @NotNull(message = "Year is required")
    private Integer year;

    /** Allowance as % of base salary (default 20). */
    @Min(value = 0, message = "Allowance percentage must be ≥ 0")
    @Max(value = 100, message = "Allowance percentage must be ≤ 100")
    private Double allowancePercentage;

    /** Deduction as % of gross (default 10). */
    @Min(value = 0, message = "Deduction percentage must be ≥ 0")
    @Max(value = 100, message = "Deduction percentage must be ≤ 100")
    private Double deductionPercentage;

    /** Flat bonus added to each employee's allowances this run (e.g. festival bonus). */
    @Min(value = 0, message = "Bonus amount must be ≥ 0")
    private BigDecimal bonusAmount;

    private String remarks;
}
