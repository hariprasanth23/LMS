package com.college.examination.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class ArrearRegistrationRequest {
    @NotNull
    private List<CourseItem> courses;

    @Data
    public static class CourseItem {
        @NotBlank private String courseCode;
        @NotBlank private String courseName;
        private String regulation;
        @NotNull private Integer feeAmount;
    }
}
