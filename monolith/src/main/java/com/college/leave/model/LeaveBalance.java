package com.college.leave.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(schema = "leave_mgmt", name = "leave_balances")
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", columnDefinition = "uuid", unique = true, nullable = false)
    private UUID employeeId;

    @Column(name = "casual_balance")
    @Builder.Default
    private Integer casualBalance = 12;

    @Column(name = "sick_balance")
    @Builder.Default
    private Integer sickBalance = 10;

    @Column(name = "earned_balance")
    @Builder.Default
    private Integer earnedBalance = 15;

    @Column(name = "year")
    private Integer year;
}
