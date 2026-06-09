package com.college.employee.service;

import com.college.auth.model.User;
import com.college.auth.repository.UserRepository;
import com.college.employee.dto.EmployeeRequest;
import com.college.employee.dto.EmployeeResponse;
import com.college.employee.model.Employee;
import com.college.employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<EmployeeResponse> findAll(Pageable pageable) {
        return employeeRepository.findAll(pageable)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmployeeResponse findById(UUID id) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found: " + id));
        return toResponse(emp);
    }

    @Transactional(readOnly = true)
    public EmployeeResponse findMe() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Employee emp = employeeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Employee profile not found for current user"));
        return toResponse(emp);
    }

    @Transactional
    public EmployeeResponse create(EmployeeRequest request) {
        if (employeeRepository.existsByEmpCode(request.getEmpCode())) {
            throw new IllegalArgumentException("Employee code already exists: " + request.getEmpCode());
        }
        Employee emp = Employee.builder()
                .userId(request.getUserId())
                .empCode(request.getEmpCode())
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .departmentId(request.getDepartmentId())
                .designation(request.getDesignation())
                .employeeType(request.getEmployeeType())
                .joinDate(request.getJoinDate())
                .baseSalary(request.getBaseSalary())
                .qualifications(request.getQualifications())
                .status("ACTIVE")
                .build();
        return toResponse(employeeRepository.save(emp));
    }

    @Transactional
    public EmployeeResponse update(UUID id, EmployeeRequest request) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found: " + id));

        if (!emp.getEmpCode().equals(request.getEmpCode())
                && employeeRepository.existsByEmpCode(request.getEmpCode())) {
            throw new IllegalArgumentException("Employee code already in use: " + request.getEmpCode());
        }

        emp.setUserId(request.getUserId());
        emp.setEmpCode(request.getEmpCode());
        emp.setName(request.getName());
        emp.setEmail(request.getEmail());
        emp.setPhone(request.getPhone());
        emp.setDepartmentId(request.getDepartmentId());
        emp.setDesignation(request.getDesignation());
        emp.setEmployeeType(request.getEmployeeType());
        emp.setJoinDate(request.getJoinDate());
        emp.setBaseSalary(request.getBaseSalary());
        emp.setQualifications(request.getQualifications());

        return toResponse(employeeRepository.save(emp));
    }

    @Transactional
    public void deactivate(UUID id) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found: " + id));
        emp.setStatus("INACTIVE");
        employeeRepository.save(emp);
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> findByDepartment(Long deptId) {
        return employeeRepository.findByDepartmentId(deptId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private EmployeeResponse toResponse(Employee e) {
        return EmployeeResponse.builder()
                .id(e.getId())
                .userId(e.getUserId())
                .empCode(e.getEmpCode())
                .name(e.getName())
                .email(e.getEmail())
                .phone(e.getPhone())
                .departmentId(e.getDepartmentId())
                .designation(e.getDesignation())
                .employeeType(e.getEmployeeType())
                .joinDate(e.getJoinDate())
                .baseSalary(e.getBaseSalary())
                .status(e.getStatus())
                .qualifications(e.getQualifications())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }
}
