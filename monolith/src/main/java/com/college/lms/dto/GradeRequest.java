package com.college.lms.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GradeRequest {

    @NotNull(message = "Marks are required")
    @Min(0)
    private Integer marks;

    private String feedback;
}
