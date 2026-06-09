package com.college.lms.service;

import com.college.lms.dto.CourseRequest;
import com.college.lms.model.Course;
import com.college.lms.repository.CourseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock private CourseRepository courseRepository;
    @InjectMocks private CourseService courseService;

    private CourseRequest request;
    private Course savedCourse;
    private UUID courseId;

    @BeforeEach
    void setUp() {
        courseId = UUID.randomUUID();

        request = new CourseRequest();
        request.setCode("CS101");
        request.setName("Introduction to CS");
        request.setCredits(3);
        request.setSemester(1);

        savedCourse = Course.builder()
                .id(courseId)
                .code("CS101")
                .name("Introduction to CS")
                .credits(3)
                .semester(1)
                .status("ACTIVE")
                .build();
    }

    // ── findAll ────────────────────────────────────────────────────────────────

    @Test
    void findAll_returnsListFromRepository() {
        Pageable pageable = PageRequest.of(0, 50);
        when(courseRepository.findAll(pageable)).thenReturn(new PageImpl<>(List.of(savedCourse)));

        List<Course> result = courseService.findAll(pageable);

        assertThat(result).hasSize(1).contains(savedCourse);
    }

    // ── findById ──────────────────────────────────────────────────────────────

    @Test
    void findById_existingCourse_returnsCourse() {
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(savedCourse));

        Course result = courseService.findById(courseId);

        assertThat(result.getCode()).isEqualTo("CS101");
    }

    @Test
    void findById_missingCourse_throwsIllegalArgument() {
        when(courseRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

        assertThatThrownBy(() -> courseService.findById(UUID.randomUUID()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Course not found");
    }

    // ── create ────────────────────────────────────────────────────────────────

    @Test
    void create_newCode_savedWithUpperCaseCode() {
        // Service calls existsByCode(request.getCode()) — raw, before .toUpperCase()
        request.setCode("cs101");
        when(courseRepository.existsByCode("cs101")).thenReturn(false);
        when(courseRepository.save(any(Course.class))).thenReturn(savedCourse);

        Course result = courseService.create(request);

        assertThat(result).isNotNull();
        // Builder sets code via request.getCode().toUpperCase() → "CS101"
        verify(courseRepository).save(argThat(c -> "CS101".equals(c.getCode())));
    }

    @Test
    void create_defaultsStatusToActive_whenStatusNotProvided() {
        request.setStatus(null);
        when(courseRepository.existsByCode(anyString())).thenReturn(false);
        when(courseRepository.save(any(Course.class))).thenReturn(savedCourse);

        courseService.create(request);

        verify(courseRepository).save(argThat(c -> "ACTIVE".equals(c.getStatus())));
    }

    @Test
    void create_duplicateCode_throwsIllegalState() {
        when(courseRepository.existsByCode("CS101")).thenReturn(true);

        assertThatThrownBy(() -> courseService.create(request))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("CS101");

        verify(courseRepository, never()).save(any());
    }

    // ── update ────────────────────────────────────────────────────────────────

    @Test
    void update_sameCode_updatesOtherFields() {
        request.setName("Advanced CS");
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(savedCourse));
        when(courseRepository.save(any(Course.class))).thenAnswer(inv -> inv.getArgument(0));

        Course result = courseService.update(courseId, request);

        assertThat(result.getName()).isEqualTo("Advanced CS");
        // existsByCode must NOT be called if the code didn't change
        verify(courseRepository, never()).existsByCode(anyString());
    }

    @Test
    void update_codeChangedToTakenCode_throwsIllegalState() {
        request.setCode("CS202");
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(savedCourse));
        when(courseRepository.existsByCode("CS202")).thenReturn(true);

        assertThatThrownBy(() -> courseService.update(courseId, request))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("CS202");
    }

    // ── delete ────────────────────────────────────────────────────────────────

    @Test
    void delete_existingCourse_deletesFromRepository() {
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(savedCourse));

        courseService.delete(courseId);

        verify(courseRepository).delete(savedCourse);
    }
}
