package com.college.student.service;

import com.college.student.dto.DepartmentRequest;
import com.college.student.model.Department;
import com.college.student.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public List<Department> findAll() {
        return departmentRepository.findAll();
    }

    public Department findById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Department not found with id: " + id));
    }

    @Transactional
    public Department create(DepartmentRequest request) {
        if (departmentRepository.existsByName(request.getName())) {
            throw new IllegalStateException("Department with name '" + request.getName() + "' already exists");
        }
        if (departmentRepository.existsByCode(request.getCode())) {
            throw new IllegalStateException("Department with code '" + request.getCode() + "' already exists");
        }
        Department department = Department.builder()
                .name(request.getName())
                .code(request.getCode().toUpperCase())
                .description(request.getDescription())
                .headFacultyId(request.getHeadFacultyId())
                .email(request.getEmail())
                .phone(request.getPhone())
                .location(request.getLocation())
                .establishedYear(request.getEstablishedYear())
                .totalSeats(request.getTotalSeats())
                .build();
        return departmentRepository.save(department);
    }

    @Transactional
    public Department update(Long id, DepartmentRequest request) {
        Department department = findById(id);
        if (!department.getName().equals(request.getName()) && departmentRepository.existsByName(request.getName())) {
            throw new IllegalStateException("Department with name '" + request.getName() + "' already exists");
        }
        if (!department.getCode().equals(request.getCode()) && departmentRepository.existsByCode(request.getCode())) {
            throw new IllegalStateException("Department with code '" + request.getCode() + "' already exists");
        }
        department.setName(request.getName());
        department.setCode(request.getCode().toUpperCase());
        department.setDescription(request.getDescription());
        department.setHeadFacultyId(request.getHeadFacultyId());
        department.setEmail(request.getEmail());
        department.setPhone(request.getPhone());
        department.setLocation(request.getLocation());
        department.setEstablishedYear(request.getEstablishedYear());
        department.setTotalSeats(request.getTotalSeats());
        return departmentRepository.save(department);
    }

    @Transactional
    public void delete(Long id) {
        Department department = findById(id);
        departmentRepository.delete(department);
    }
}
