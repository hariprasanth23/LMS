package com.lms.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class StudentRequest {
    @NotNull  private UUID userId;
    @NotBlank private String rollNumber;
    @NotNull  private Long departmentId;
    @NotBlank private String program;
    @NotNull  private Integer semester;
    private String section;
    @NotBlank private String batch;
    @NotNull  private Integer admissionYear;
    private LocalDate joinDate;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodGroup;
    private String category;
    private String aadhaarNumber;
    private String address;
    private String fatherName;
    private String motherName;
    private String parentPhone;
    private String guardianName;
    private String guardianPhone;
    private String emergencyContactName;
    private String emergencyContactPhone;
}
