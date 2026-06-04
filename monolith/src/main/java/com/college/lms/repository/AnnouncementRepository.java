package com.college.lms.repository;

import com.college.lms.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, UUID> {

    List<Announcement> findByCourseId(UUID courseId);

    // global announcements where courseId is null
    List<Announcement> findByCourseIdIsNull();

    @Query("SELECT a FROM Announcement a WHERE a.courseId = :courseId OR a.courseId IS NULL ORDER BY a.createdAt DESC")
    List<Announcement> findByCourseIdOrGlobal(UUID courseId);
}
