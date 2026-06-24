package com.lms.user.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.lms.user.model.Employee;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmployeeResponse {
    private final UUID id;
    private final UUID userId;
    private final String empCode;
    private final String name;
    private final String email;
    private final String phone;
    private final Long departmentId;
    private final String departmentName;
    private final String designation;
    private final String employeeType;
    private final LocalDate joinDate;
    private final BigDecimal baseSalary;
    private final String status;

    public static EmployeeResponse of(Employee e, String departmentName) {
        return EmployeeResponse.builder()
                .id(e.getId()).userId(e.getUserId()).empCode(e.getEmpCode())
                .name(e.getName()).email(e.getEmail()).phone(e.getPhone())
                .departmentId(e.getDepartmentId()).departmentName(departmentName)
                .designation(e.getDesignation()).employeeType(e.getEmployeeType())
                .joinDate(e.getJoinDate()).baseSalary(e.getBaseSalary()).status(e.getStatus())
                .build();
    }
}
