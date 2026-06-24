package com.lms.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BankInfoRequest {
    @NotBlank private String accountHolderName;
    @NotBlank private String bankName;
    @NotBlank private String accountNumber;
    @NotBlank private String ifscCode;
    private String branch;
}
