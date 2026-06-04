package com.college.attendance.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class MarkStudentAttendanceRequest {

    @NotNull(message = "Course ID is required")
    private UUID courseId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotEmpty(message = "At least one attendance entry is required")
    @Valid
    private List<StudentAttendanceEntry> entries;
}
