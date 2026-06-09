package com.college.student.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentImportRow {

    // ── Required for account creation ─────────────────────────────────────────

    @NotBlank(message = "Name is required")
    @Size(max = 150)
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 150)
    private String email;

    @Size(max = 20)
    private String phone;

    // ── Academic Identity ─────────────────────────────────────────────────────

    @NotBlank(message = "Roll number is required")
    @Size(max = 20)
    private String rollNumber;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @Size(max = 50)
    private String program;

    @NotNull(message = "Semester is required")
    @Min(value = 1, message = "Semester must be between 1 and 8")
    @Max(value = 8, message = "Semester must be between 1 and 8")
    private Integer semester;

    @Size(max = 10)
    private String section;

    @Size(max = 20)
    private String batch;

    @Min(2000) @Max(2100)
    private Integer admissionYear;

    private LocalDate joinDate;

    @Size(max = 20)
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
