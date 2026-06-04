package com.college.lms.service;

import com.college.lms.dto.CourseMaterialRequest;
import com.college.lms.model.CourseMaterial;
import com.college.lms.repository.CourseMaterialRepository;
import com.college.lms.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseMaterialService {

    private final CourseMaterialRepository materialRepository;
    private final CourseRepository courseRepository;

    public List<CourseMaterial> findByCourse(UUID courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new IllegalArgumentException("Course not found with id: " + courseId);
        }
        return materialRepository.findByCourseId(courseId);
    }

    @Transactional
    public CourseMaterial addMaterial(UUID courseId, CourseMaterialRequest request) {
        if (!courseRepository.existsById(courseId)) {
            throw new IllegalArgumentException("Course not found with id: " + courseId);
        }
        CourseMaterial material = CourseMaterial.builder()
                .courseId(courseId)
                .title(request.getTitle())
                .type(request.getType())
                .url(request.getUrl())
                .content(request.getContent())
                .build();
        return materialRepository.save(material);
    }

    @Transactional
    public void deleteMaterial(UUID materialId) {
        CourseMaterial material = materialRepository.findById(materialId)
                .orElseThrow(() -> new IllegalArgumentException("Material not found with id: " + materialId));
        materialRepository.delete(material);
    }
}
