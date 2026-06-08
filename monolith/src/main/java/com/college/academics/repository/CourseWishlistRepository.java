package com.college.academics.repository;

import com.college.academics.model.CourseWishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CourseWishlistRepository extends JpaRepository<CourseWishlist, UUID> {
    List<CourseWishlist> findByStudentIdOrderByAddedAtDesc(UUID studentId);
    boolean existsByStudentIdAndCourseCode(UUID studentId, String courseCode);
    void deleteByStudentIdAndCourseCode(UUID studentId, String courseCode);
}
