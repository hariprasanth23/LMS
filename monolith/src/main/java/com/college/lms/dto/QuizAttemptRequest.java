package com.college.lms.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;
import java.util.UUID;

@Data
public class QuizAttemptRequest {

    // Map of questionId -> chosen option (A/B/C/D)
    @NotNull(message = "Answers are required")
    private Map<UUID, String> answers;
}
