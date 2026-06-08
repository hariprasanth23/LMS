package com.college.examination.repository;

import com.college.examination.model.InternalMark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface InternalMarkRepository extends JpaRepository<InternalMark, UUID> {
    List<InternalMark> findByStudentIdAndSemesterOrderByCourseCode(UUID studentId, Integer semester);
    List<InternalMark> findByStudentIdOrderBySemesterDescCourseCode(UUID studentId);
}
