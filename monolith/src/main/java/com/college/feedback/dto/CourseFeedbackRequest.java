package com.college.feedback.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CourseFeedbackRequest {
    @NotNull
    private List<FeedbackItem> feedbacks;

    @Data
    public static class FeedbackItem {
        @NotBlank private String courseCode;
        private String courseName;
        private String facultyName;
        private Integer contentDelivery;
        private Integer teachingClarity;
        private Integer studentEngagement;
        private Integer useOfTechnology;
        private Integer availabilityForDoubts;
        private String comments;
    }
}
