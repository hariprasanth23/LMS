package com.lms.user.service;

import com.lms.user.dto.BankInfoRequest;
import com.lms.user.dto.StudentRequest;
import com.lms.user.model.Student;
import com.lms.user.model.StudentBankInfo;
import com.lms.user.repository.StudentBankInfoRepository;
import com.lms.user.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepo;
    private final StudentBankInfoRepository bankRepo;

    public Page<Student> page(Pageable p) { return studentRepo.findAll(p); }

    public Student findById(UUID id) {
        return studentRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Student not found"));
    }

    public Student findByUserId(UUID userId) {
        return studentRepo.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found for this user"));
    }

    @Transactional
    public Student create(StudentRequest req) {
        if (studentRepo.existsByRollNumber(req.getRollNumber()))
            throw new IllegalStateException("Roll number already exists");
        return studentRepo.save(Student.builder()
                .userId(req.getUserId()).rollNumber(req.getRollNumber())
                .departmentId(req.getDepartmentId()).program(req.getProgram())
                .semester(req.getSemester()).section(req.getSection()).batch(req.getBatch())
                .admissionYear(req.getAdmissionYear()).joinDate(req.getJoinDate())
                .dateOfBirth(req.getDateOfBirth()).gender(req.getGender())
                .bloodGroup(req.getBloodGroup()).category(req.getCategory())
                .aadhaarNumber(req.getAadhaarNumber()).address(req.getAddress())
                .fatherName(req.getFatherName()).motherName(req.getMotherName())
                .parentPhone(req.getParentPhone()).guardianName(req.getGuardianName())
                .guardianPhone(req.getGuardianPhone())
                .emergencyContactName(req.getEmergencyContactName())
                .emergencyContactPhone(req.getEmergencyContactPhone())
                .status("ACTIVE").build());
    }

    @Transactional
    public Student update(UUID id, StudentRequest req) {
        Student s = findById(id);
        s.setDepartmentId(req.getDepartmentId());
        s.setProgram(req.getProgram());
        s.setSemester(req.getSemester());
        s.setSection(req.getSection());
        s.setBatch(req.getBatch());
        s.setAddress(req.getAddress());
        s.setParentPhone(req.getParentPhone());
        s.setGuardianPhone(req.getGuardianPhone());
        return studentRepo.save(s);
    }

    @Transactional
    public void delete(UUID id) { studentRepo.deleteById(id); }

    public StudentBankInfo bankInfoForUser(UUID userId) {
        Student s = findByUserId(userId);
        return bankRepo.findByStudentId(s.getId()).orElse(null);
    }

    @Transactional
    public StudentBankInfo saveBankInfo(UUID userId, BankInfoRequest req) {
        Student s = findByUserId(userId);
        StudentBankInfo info = bankRepo.findByStudentId(s.getId())
                .orElseGet(() -> StudentBankInfo.builder().studentId(s.getId()).build());
        info.setAccountHolderName(req.getAccountHolderName());
        info.setBankName(req.getBankName());
        info.setAccountNumber(req.getAccountNumber());
        info.setIfscCode(req.getIfscCode());
        info.setBranch(req.getBranch());
        return bankRepo.save(info);
    }
}
