package com.college.attendance.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
    schema = "attendance",
    name = "employee_attendance",
    uniqueConstraints = @UniqueConstraint(columnNames = {"employee_id", "date"}),
    indexes = {
        @jakarta.persistence.Index(name = "idx_ea_employee_id",   columnList = "employee_id"),
        @jakarta.persistence.Index(name = "idx_ea_employee_date", columnList = "employee_id, date")
    }
)
public class EmployeeAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid DEFAULT gen_random_uuid()")
    private UUID id;

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "check_in")
    private LocalTime checkIn;

    @Column(name = "check_out")
    private LocalTime checkOut;

    @Column(name = "status", length = 20)
    private String status;

    @Column(name = "remarks", length = 200)
    private String remarks;
}
