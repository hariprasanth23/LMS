package com.college.attendance.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.UUID;

@Data
public class StudentAttendanceEntry {

    @NotNull(message = "Student ID is required")
    private UUID studentId;

    @NotNull(message = "Status is required")
    @Pattern(regexp = "PRESENT|ABSENT|LATE|EXCUSED", message = "Status must be PRESENT, ABSENT, LATE, or EXCUSED")
    private String status;
}
