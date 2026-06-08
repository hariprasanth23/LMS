package com.college.examination.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class MakeupExamRequest {
    @NotBlank private String courseCode;
    @NotBlank private String courseName;
    @NotBlank private String reason;
    @NotNull  private LocalDate absenceDate;
    private String detailedReason;
    private String supportingDoc;
}
