package com.college.lms.dto;

import lombok.Data;

@Data
public class SubmissionRequest {

    private String fileUrl;

    private String content;
}
