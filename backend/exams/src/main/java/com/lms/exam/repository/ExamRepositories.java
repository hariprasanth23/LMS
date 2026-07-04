package com.lms.exam.repository;

import com.lms.exam.model.Entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

public class ExamRepositories {

    @Repository
    public interface ExamScheduleRepository extends JpaRepository<ExamSchedule, UUID> {
        List<ExamSchedule> findAllByOrderByExamDateAsc();
    }

    @Repository
    public interface InternalMarkRepository extends JpaRepository<InternalMark, UUID> {
        List<InternalMark> findByStudentId(UUID studentId);
    }

    @Repository
    public interface SemesterGradeRepository extends JpaRepository<SemesterGrade, UUID> {
        List<SemesterGrade> findByStudentIdOrderBySemesterDesc(UUID studentId);
    }

    @Repository
    public interface ArrearRepository extends JpaRepository<ArrearRegistration, UUID> {
        List<ArrearRegistration> findByStudentId(UUID studentId);
    }

    @Repository
    public interface MakeupRepository extends JpaRepository<MakeupApplication, UUID> {
        List<MakeupApplication> findByStudentIdOrderByAppliedAtDesc(UUID studentId);
    }

    @Repository
    public interface ScheduledOnlineExamRepository extends JpaRepository<ScheduledOnlineExam, UUID> {
        List<ScheduledOnlineExam> findByStudentIdAndStatus(UUID studentId, String status);
    }
}
