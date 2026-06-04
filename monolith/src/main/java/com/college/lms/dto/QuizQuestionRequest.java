package com.college.lms.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class QuizQuestionRequest {

    @NotBlank(message = "Question is required")
    private String question;

    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;

    @Pattern(regexp = "A|B|C|D", message = "Correct option must be A, B, C, or D")
    private String correctOption;

    @Min(1)
    private Integer marks;
}
