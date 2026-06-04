package com.college.lms.service;

import com.college.auth.model.User;
import com.college.lms.dto.AnnouncementRequest;
import com.college.lms.model.Announcement;
import com.college.lms.repository.AnnouncementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    public List<Announcement> findAll() {
        return announcementRepository.findAll();
    }

    public List<Announcement> findByCourseOrGlobal(UUID courseId) {
        return announcementRepository.findByCourseIdOrGlobal(courseId);
    }

    @Transactional
    public Announcement create(AnnouncementRequest request, User currentUser) {
        Announcement announcement = Announcement.builder()
                .courseId(request.getCourseId())
                .title(request.getTitle())
                .content(request.getContent())
                .postedBy(currentUser.getId())
                .build();
        return announcementRepository.save(announcement);
    }

    @Transactional
    public void delete(UUID id) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Announcement not found with id: " + id));
        announcementRepository.delete(announcement);
    }
}
