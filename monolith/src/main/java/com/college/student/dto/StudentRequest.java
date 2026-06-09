package com.college.student.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class StudentRequest {

    // userId is set internally by the controller (created from email) — not submitted by the client
    private UUID userId;

    // ── Academic Identity ─────────────────────────────────────────────────────

    @NotBlank(message = "Roll number is required")
    @Size(max = 20)
    private String rollNumber;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @Size(max = 50)
    private String program;             // B.Tech, M.Tech, Ph.D, etc.

    @Min(1) @Max(8)
    private Integer semester;

    @Size(max = 10)
    private String section;

    @Size(max = 20)
    private String batch;               // e.g. 2023-27

    @Min(2000) @Max(2100)
    private Integer admissionYear;

    private LocalDate joinDate;

    @Pattern(regexp = "ACTIVE|INACTIVE|GRADUATED|DROPPED", message = "Invalid status")
    private String status;

    // ── Personal ──────────────────────────────────────────────────────────────

    private LocalDate dateOfBirth;

    @Pattern(regexp = "MALE|FEMALE|OTHER", message = "Gender must be MALE, FEMALE, or OTHER")
    private String gender;

    @Pattern(regexp = "A\\+|A-|B\\+|B-|O\\+|O-|AB\\+|AB-", message = "Invalid blood group")
    private String bloodGroup;

    @Pattern(regexp = "GENERAL|OBC|SC|ST|NT|EWS", message = "Invalid category")
    private String category;

    @Pattern(regexp = "\\d{12}", message = "Aadhaar number must be 12 digits")
    private String aadhaarNumber;

    // ── Contact ───────────────────────────────────────────────────────────────

    private String address;

    // ── Family ───────────────────────────────────────────────────────────────

    @Size(max = 100)
    private String fatherName;

    @Size(max = 100)
    private String motherName;

    @Size(max = 20)
    private String parentPhone;

    @Size(max = 100)
    private String guardianName;

    @Size(max = 20)
    private String guardianPhone;

    // ── Emergency ─────────────────────────────────────────────────────────────

    @Size(max = 100)
    private String emergencyContactName;

    @Size(max = 20)
    private String emergencyContactPhone;
}
