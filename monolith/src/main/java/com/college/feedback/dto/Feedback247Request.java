package com.college.feedback.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class Feedback247Request {
    @NotBlank private String courseCode;
    private String courseName;
    @NotBlank private String feedbackType;
    private String topic;
    private Integer rating;
    @NotBlank @Size(min = 50) private String feedbackText;
    private Boolean anonymous = true;
}
