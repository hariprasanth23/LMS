package com.college.payroll.service;

import com.college.auth.model.User;
import com.college.auth.repository.UserRepository;
import com.college.employee.model.Employee;
import com.college.employee.repository.EmployeeRepository;
import com.college.payroll.dto.PayrollGenerateRequest;
import com.college.payroll.dto.PayrollResponse;
import com.college.payroll.model.PayrollRecord;
import com.college.payroll.repository.PayrollRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PayrollService {

    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    @Transactional
    public List<PayrollResponse> generatePayroll(PayrollGenerateRequest request) {
        List<Employee> activeEmployees = employeeRepository.findByStatus("ACTIVE");
        List<PayrollRecord> generated = new ArrayList<>();

        for (Employee emp : activeEmployees) {
            if (payrollRepository.findByEmployeeIdAndMonthAndYear(
                    emp.getId(), request.getMonth(), request.getYear()).isPresent()) {
                continue; // already generated for this employee
            }

            BigDecimal base = emp.getBaseSalary() != null ? emp.getBaseSalary() : BigDecimal.ZERO;
            // Use caller-supplied percentages or fall back to defaults (20% / 10%)
            BigDecimal allowancePct = request.getAllowancePercentage() != null
                    ? BigDecimal.valueOf(request.getAllowancePercentage() / 100.0)
                    : new BigDecimal("0.20");
            BigDecimal deductionPct = request.getDeductionPercentage() != null
                    ? BigDecimal.valueOf(request.getDeductionPercentage() / 100.0)
                    : new BigDecimal("0.10");
            BigDecimal bonus = request.getBonusAmount() != null ? request.getBonusAmount() : BigDecimal.ZERO;

            BigDecimal allowances = base.multiply(allowancePct).add(bonus);
            BigDecimal deductions = base.multiply(deductionPct);
            BigDecimal leaveDeductions = BigDecimal.ZERO;
            BigDecimal netSalary = base.add(allowances).subtract(deductions).subtract(leaveDeductions);

            PayrollRecord record = PayrollRecord.builder()
                    .employeeId(emp.getId())
                    .month(request.getMonth())
                    .year(request.getYear())
                    .baseSalary(base)
                    .allowances(allowances)
                    .deductions(deductions)
                    .leaveDeductions(leaveDeductions)
                    .netSalary(netSalary)
                    .status("DRAFT")
                    .remarks(request.getRemarks())
                    .build();

            generated.add(payrollRepository.save(record));
        }

        return generated.stream().map(r -> toResponse(r, null)).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PayrollResponse> getAll(Integer month, Integer year) {
        List<PayrollRecord> records;
        if (month != null && year != null) {
            records = payrollRepository.findByMonthAndYearOrderByCreatedAtDesc(month, year);
        } else {
            records = payrollRepository.findAllByOrderByYearDescMonthDesc();
        }
        return records.stream().map(r -> toResponseWithEmployee(r)).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PayrollResponse> getMyPayslips() {
        Employee employee = resolveCurrentEmployee();
        return payrollRepository.findByEmployeeIdOrderByYearDescMonthDesc(employee.getId())
                .stream()
                .map(r -> toResponse(r, employee.getName()))
                .collect(Collectors.toList());
    }

    @Transactional
    public PayrollResponse process(UUID id) {
        PayrollRecord record = payrollRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payroll record not found: " + id));
        record.setStatus("PROCESSED");
        record.setProcessedAt(LocalDateTime.now());
        return toResponseWithEmployee(payrollRepository.save(record));
    }

    @Transactional(readOnly = true)
    public PayrollResponse getById(UUID id) {
        PayrollRecord record = payrollRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payroll record not found: " + id));
        return toResponseWithEmployee(record);
    }

    private Employee resolveCurrentEmployee() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return employeeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Employee profile not found for current user"));
    }

    private PayrollResponse toResponseWithEmployee(PayrollRecord r) {
        Employee emp = employeeRepository.findById(r.getEmployeeId()).orElse(null);
        String name = emp != null ? emp.getName() : null;
        String code = emp != null ? emp.getEmpCode() : null;
        return toResponseFull(r, name, code);
    }

    private PayrollResponse toResponse(PayrollRecord r, String employeeName) {
        return toResponseFull(r, employeeName, null);
    }

    private PayrollResponse toResponseFull(PayrollRecord r, String name, String code) {
        return PayrollResponse.builder()
                .id(r.getId())
                .employeeId(r.getEmployeeId())
                .employeeName(name)
                .empCode(code)
                .month(r.getMonth())
                .year(r.getYear())
                .baseSalary(r.getBaseSalary())
                .allowances(r.getAllowances())
                .deductions(r.getDeductions())
                .leaveDeductions(r.getLeaveDeductions())
                .netSalary(r.getNetSalary())
                .status(r.getStatus())
                .processedAt(r.getProcessedAt())
                .remarks(r.getRemarks())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
