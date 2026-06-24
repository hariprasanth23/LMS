package com.lms.user.service;

import com.lms.user.dto.EmployeeRequest;
import com.lms.user.dto.EmployeeResponse;
import com.lms.user.model.Department;
import com.lms.user.model.Employee;
import com.lms.user.repository.DepartmentRepository;
import com.lms.user.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository repo;
    private final DepartmentRepository deptRepo;

    public Page<EmployeeResponse> page(Pageable p) {
        return repo.findAll(p).map(this::resolve);
    }

    public EmployeeResponse byId(UUID id) {
        return resolve(repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found")));
    }

    public EmployeeResponse byUserId(UUID userId) {
        return resolve(repo.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Employee profile not found for this user")));
    }

    public Page<EmployeeResponse> byDepartment(Long deptId, Pageable p) {
        return repo.findByDepartmentId(deptId, p).map(this::resolve);
    }

    @Transactional
    public EmployeeResponse create(EmployeeRequest req) {
        if (repo.existsByEmpCode(req.getEmpCode()))
            throw new IllegalStateException("Employee code already exists");
        if (repo.existsByEmail(req.getEmail()))
            throw new IllegalStateException("Employee email already exists");
        Employee e = repo.save(Employee.builder()
                .userId(req.getUserId()).empCode(req.getEmpCode())
                .name(req.getName()).email(req.getEmail()).phone(req.getPhone())
                .departmentId(req.getDepartmentId()).designation(req.getDesignation())
                .employeeType(req.getEmployeeType()).joinDate(req.getJoinDate())
                .baseSalary(req.getBaseSalary()).qualifications(req.getQualifications())
                .status("ACTIVE").build());
        return resolve(e);
    }

    @Transactional
    public EmployeeResponse update(UUID id, EmployeeRequest req) {
        Employee e = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));
        e.setName(req.getName());
        e.setPhone(req.getPhone());
        e.setDesignation(req.getDesignation());
        e.setDepartmentId(req.getDepartmentId());
        e.setBaseSalary(req.getBaseSalary());
        e.setQualifications(req.getQualifications());
        return resolve(repo.save(e));
    }

    @Transactional
    public void deactivate(UUID id) {
        Employee e = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));
        e.setStatus("INACTIVE");
        repo.save(e);
    }

    private EmployeeResponse resolve(Employee e) {
        String deptName = deptRepo.findById(e.getDepartmentId())
                .map(Department::getName).orElse(null);
        return EmployeeResponse.of(e, deptName);
    }
}
