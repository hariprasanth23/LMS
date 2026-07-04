package com.lms.user.service;

import com.lms.user.dto.DepartmentRequest;
import com.lms.user.model.Department;
import com.lms.user.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository repo;

    public List<Department> findAll() { return repo.findAll(); }

    public Department findById(Long id) {
        return repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Department not found"));
    }

    @Transactional
    public Department create(DepartmentRequest req) {
        if (repo.existsByCode(req.getCode())) throw new IllegalStateException("Department code already exists");
        if (repo.existsByName(req.getName())) throw new IllegalStateException("Department name already exists");
        return repo.save(Department.builder()
                .name(req.getName()).code(req.getCode()).description(req.getDescription())
                .email(req.getEmail()).phone(req.getPhone()).location(req.getLocation())
                .establishedYear(req.getEstablishedYear()).totalSeats(req.getTotalSeats())
                .build());
    }

    @Transactional
    public Department update(Long id, DepartmentRequest req) {
        Department d = findById(id);
        d.setName(req.getName());
        d.setDescription(req.getDescription());
        d.setEmail(req.getEmail());
        d.setPhone(req.getPhone());
        d.setLocation(req.getLocation());
        d.setEstablishedYear(req.getEstablishedYear());
        d.setTotalSeats(req.getTotalSeats());
        return repo.save(d);
    }

    @Transactional
    public void delete(Long id) { repo.deleteById(id); }
}
