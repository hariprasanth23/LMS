package com.college.student.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentImportRow {
    private String name;
    private String email;
    private String phone;
    private String rollNumber;
    private Long departmentId;
    private Integer semester;
    private String batch;
    private LocalDate joinDate;
    private String status;
    private String guardianName;
    private String guardianPhone;
    private String address;
}
