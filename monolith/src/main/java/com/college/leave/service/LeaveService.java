package com.college.leave.service;

import com.college.auth.model.User;
import com.college.auth.repository.UserRepository;
import com.college.employee.model.Employee;
import com.college.employee.repository.EmployeeRepository;
import com.college.leave.dto.LeaveRequestDto;
import com.college.leave.dto.LeaveRequestResponse;
import com.college.leave.dto.LeaveReviewDto;
import com.college.leave.model.LeaveBalance;
import com.college.leave.model.LeaveRequest;
import com.college.leave.repository.LeaveBalanceRepository;
import com.college.leave.repository.LeaveRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    private Employee resolveCurrentEmployee() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return employeeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Employee profile not found for current user"));
    }

    private User resolveCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Transactional
    public LeaveRequestResponse apply(LeaveRequestDto dto) {
        Employee employee = resolveCurrentEmployee();

        if (dto.getToDate().isBefore(dto.getFromDate())) {
            throw new IllegalArgumentException("To date must be after from date");
        }

        LeaveRequest req = LeaveRequest.builder()
                .employeeId(employee.getId())
                .leaveType(dto.getLeaveType())
                .fromDate(dto.getFromDate())
                .toDate(dto.getToDate())
                .reason(dto.getReason())
                .status("PENDING")
                .build();

        return toResponse(leaveRequestRepository.save(req));
    }

    @Transactional(readOnly = true)
    public List<LeaveRequestResponse> getMyRequests() {
        Employee employee = resolveCurrentEmployee();
        return leaveRequestRepository.findByEmployeeIdOrderByCreatedAtDesc(employee.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LeaveRequestResponse> getAllRequests() {
        return leaveRequestRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public LeaveRequestResponse approve(UUID id, LeaveReviewDto reviewDto) {
        User reviewer = resolveCurrentUser();
        LeaveRequest req = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found: " + id));

        if (!"PENDING".equals(req.getStatus())) {
            throw new IllegalStateException("Leave request is not in PENDING status");
        }

        req.setStatus("APPROVED");
        req.setReviewedBy(reviewer.getId());
        req.setReviewNote(reviewDto != null ? reviewDto.getReviewNote() : null);

        deductLeaveBalance(req);

        return toResponse(leaveRequestRepository.save(req));
    }

    @Transactional
    public LeaveRequestResponse reject(UUID id, LeaveReviewDto reviewDto) {
        User reviewer = resolveCurrentUser();
        LeaveRequest req = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found: " + id));

        if (!"PENDING".equals(req.getStatus())) {
            throw new IllegalStateException("Leave request is not in PENDING status");
        }

        req.setStatus("REJECTED");
        req.setReviewedBy(reviewer.getId());
        req.setReviewNote(reviewDto != null ? reviewDto.getReviewNote() : null);

        return toResponse(leaveRequestRepository.save(req));
    }

    @Transactional(readOnly = true)
    public LeaveBalance getBalance() {
        Employee employee = resolveCurrentEmployee();
        int year = LocalDate.now().getYear();
        return leaveBalanceRepository.findByEmployeeIdAndYear(employee.getId(), year)
                .orElseGet(() -> LeaveBalance.builder()
                        .employeeId(employee.getId())
                        .year(year)
                        .casualBalance(12)
                        .sickBalance(10)
                        .earnedBalance(15)
                        .build());
    }

    private void deductLeaveBalance(LeaveRequest req) {
        int year = req.getFromDate().getYear();
        // Pessimistic write lock prevents two simultaneous approvals from double-deducting balance
        LeaveBalance balance = leaveBalanceRepository
                .findByEmployeeIdAndYearForUpdate(req.getEmployeeId(), year)
                .orElseGet(() -> LeaveBalance.builder()
                        .employeeId(req.getEmployeeId())
                        .year(year)
                        .casualBalance(12)
                        .sickBalance(10)
                        .earnedBalance(15)
                        .build());

        long days = req.getFromDate().datesUntil(req.getToDate().plusDays(1)).count();
        int d = (int) days;

        switch (req.getLeaveType()) {
            case "CASUAL" -> balance.setCasualBalance(Math.max(0, balance.getCasualBalance() - d));
            case "SICK" -> balance.setSickBalance(Math.max(0, balance.getSickBalance() - d));
            case "EARNED" -> balance.setEarnedBalance(Math.max(0, balance.getEarnedBalance() - d));
            default -> { /* MATERNITY, PATERNITY, UNPAID — no balance deduction */ }
        }

        leaveBalanceRepository.save(balance);
    }

    private LeaveRequestResponse toResponse(LeaveRequest r) {
        return LeaveRequestResponse.builder()
                .id(r.getId())
                .employeeId(r.getEmployeeId())
                .leaveType(r.getLeaveType())
                .fromDate(r.getFromDate())
                .toDate(r.getToDate())
                .reason(r.getReason())
                .status(r.getStatus())
                .reviewedBy(r.getReviewedBy())
                .reviewNote(r.getReviewNote())
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
                .build();
    }
}
