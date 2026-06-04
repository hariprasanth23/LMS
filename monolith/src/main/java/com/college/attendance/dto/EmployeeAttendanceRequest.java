package com.college.attendance.dto;

import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class EmployeeAttendanceRequest {

    private LocalDate date;

    private LocalTime checkIn;

    private LocalTime checkOut;

    @Pattern(regexp = "PRESENT|ABSENT|HALF_DAY|ON_LEAVE", message = "Status must be PRESENT, ABSENT, HALF_DAY, or ON_LEAVE")
    private String status;

    private String remarks;
}
