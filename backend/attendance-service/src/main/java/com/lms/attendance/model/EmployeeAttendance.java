package com.lms.attendance.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "employee_attendance",
       uniqueConstraints = @UniqueConstraint(columnNames = {"employee_id", "date"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EmployeeAttendance {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "employee_id", nullable = false) private UUID employeeId;
    @Column(nullable = false)                        private LocalDate date;
    @Column(nullable = false, length = 10)           private String status;
    @Column(name = "check_in")  private LocalTime checkIn;
    @Column(name = "check_out") private LocalTime checkOut;
    @Column(name = "marked_by") private UUID markedBy;
    @CreationTimestamp @Column(name = "marked_at", updatable = false) private Instant markedAt;
}
