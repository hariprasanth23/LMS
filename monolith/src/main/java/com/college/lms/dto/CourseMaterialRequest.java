package com.college.lms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CourseMaterialRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200)
    private String title;

    @Pattern(regexp = "PDF|VIDEO|LINK|NOTE", message = "Type must be PDF, VIDEO, LINK, or NOTE")
    private String type;

    private String url;

    private String content;
}
