package com.college.examination.repository;

import com.college.examination.model.ExamSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ExamScheduleRepository extends JpaRepository<ExamSchedule, UUID> {
    List<ExamSchedule> findByDepartmentCodeAndSemesterOrderByExamDate(String departmentCode, Integer semester);
    List<ExamSchedule> findBySemesterAndDepartmentCodeOrderByExamDate(Integer semester, String departmentCode);
}
