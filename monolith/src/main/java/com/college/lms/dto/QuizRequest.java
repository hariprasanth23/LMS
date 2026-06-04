package com.college.lms.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class QuizRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200)
    private String title;

    private String description;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    @Min(1)
    private Integer durationMinutes;

    @Min(1)
    private Integer totalMarks;

    @Pattern(regexp = "DRAFT|PUBLISHED|CLOSED", message = "Status must be DRAFT, PUBLISHED, or CLOSED")
    private String status;
}
