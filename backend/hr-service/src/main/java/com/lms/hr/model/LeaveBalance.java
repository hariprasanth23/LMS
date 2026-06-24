package com.lms.hr.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "leave_balances",
       uniqueConstraints = @UniqueConstraint(columnNames = {"employee_id", "leave_type", "year"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LeaveBalance {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "employee_id", nullable = false) private UUID employeeId;
    @Column(name = "leave_type",  nullable = false, length = 10) private String leaveType;  // CL/SL/EL/ML/COL
    @Column(name = "total_days",  nullable = false) private Integer totalDays;
    @Column(name = "used_days",   nullable = false) private Integer usedDays;

    /** PG-side {@code GENERATED ALWAYS AS (total_days - used_days) STORED}. */
    @Column(insertable = false, updatable = false)
    private Integer balance;

    @Column(nullable = false) private Integer year;
}
