package com.college.lms.controller;

import com.college.auth.security.JwtUtil;
import com.college.common.config.SecurityConfig;
import com.college.lms.model.Course;
import com.college.lms.service.CourseMaterialService;
import com.college.lms.service.CourseService;
import com.college.support.WithMockCollegeUser;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CourseController.class)
@Import(SecurityConfig.class)
class CourseControllerTest {

    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper json;

    @MockBean private CourseService courseService;
    @MockBean private CourseMaterialService materialService;
    @MockBean private JwtUtil jwtUtil;
    @MockBean private UserDetailsService userDetailsService;

    private static final UUID COURSE_ID = UUID.randomUUID();

    private Course aCourse() {
        return Course.builder()
                .id(COURSE_ID)
                .code("CS101")
                .name("Intro to CS")
                .credits(3)
                .semester(1)
                .status("ACTIVE")
                .build();
    }

    // ── GET /api/courses ──────────────────────────────────────────────────────

    @Test
    @WithMockCollegeUser(role = "STUDENT")
    void getCourses_asStudent_returns200WithList() throws Exception {
        when(courseService.findAll(any())).thenReturn(List.of(aCourse()));

        mvc.perform(get("/api/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].code").value("CS101"));
    }

    @Test
    void getCourses_unauthenticated_returns403() throws Exception {
        mvc.perform(get("/api/courses"))
                .andExpect(status().isForbidden());
    }

    // ── GET /api/courses/{id} ─────────────────────────────────────────────────

    @Test
    @WithMockCollegeUser(role = "FACULTY")
    void getCourseById_exists_returns200() throws Exception {
        when(courseService.findById(COURSE_ID)).thenReturn(aCourse());

        mvc.perform(get("/api/courses/{id}", COURSE_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(COURSE_ID.toString()));
    }

    @Test
    @WithMockCollegeUser(role = "FACULTY")
    void getCourseById_notFound_returns400() throws Exception {
        when(courseService.findById(any())).thenThrow(new IllegalArgumentException("Course not found"));

        mvc.perform(get("/api/courses/{id}", UUID.randomUUID()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    // ── POST /api/courses ─────────────────────────────────────────────────────

    @Test
    @WithMockCollegeUser(role = "FACULTY")
    void createCourse_asFaculty_validBody_returns201() throws Exception {
        when(courseService.create(any())).thenReturn(aCourse());

        String body = json.writeValueAsString(Map.of(
                "code", "CS101",
                "name", "Intro to CS",
                "credits", 3,
                "semester", 1
        ));

        mvc.perform(post("/api/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.code").value("CS101"));
    }

    @Test
    @WithMockCollegeUser(role = "STUDENT")
    void createCourse_asStudent_returns403() throws Exception {
        String body = json.writeValueAsString(Map.of(
                "code", "CS101",
                "name", "Intro to CS",
                "credits", 3,
                "semester", 1
        ));

        mvc.perform(post("/api/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isForbidden());

        verify(courseService, never()).create(any());
    }

    @Test
    @WithMockCollegeUser(role = "FACULTY")
    void createCourse_missingCode_returns400WithFieldError() throws Exception {
        // "code" field absent
        String body = json.writeValueAsString(Map.of(
                "name", "Intro to CS",
                "credits", 3,
                "semester", 1
        ));

        mvc.perform(post("/api/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.data.code").exists());
    }

    @Test
    @WithMockCollegeUser(role = "FACULTY")
    void createCourse_missingName_returns400WithFieldError() throws Exception {
        String body = json.writeValueAsString(Map.of(
                "code", "CS101",
                "credits", 3,
                "semester", 1
        ));

        mvc.perform(post("/api/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.data.name").exists());
    }

    @Test
    @WithMockCollegeUser(role = "FACULTY")
    void createCourse_invalidSemester_returns400WithFieldError() throws Exception {
        String body = json.writeValueAsString(Map.of(
                "code", "CS101",
                "name", "Intro to CS",
                "credits", 3,
                "semester", 9   // max is 8
        ));

        mvc.perform(post("/api/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.data.semester").exists());
    }

    @Test
    @WithMockCollegeUser(role = "FACULTY")
    void createCourse_serviceThrowsDuplicate_returns409() throws Exception {
        when(courseService.create(any()))
                .thenThrow(new IllegalStateException("Course with code 'CS101' already exists"));

        String body = json.writeValueAsString(Map.of(
                "code", "CS101",
                "name", "Intro to CS",
                "credits", 3,
                "semester", 1
        ));

        mvc.perform(post("/api/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value(containsString("CS101")));
    }

    // ── DELETE /api/courses/{id} ──────────────────────────────────────────────

    @Test
    @WithMockCollegeUser(role = "ADMIN")
    void deleteCourse_asAdmin_returns200() throws Exception {
        doNothing().when(courseService).delete(COURSE_ID);

        mvc.perform(delete("/api/courses/{id}", COURSE_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(courseService).delete(COURSE_ID);
    }

    @Test
    @WithMockCollegeUser(role = "FACULTY")
    void deleteCourse_asFaculty_returns403() throws Exception {
        mvc.perform(delete("/api/courses/{id}", COURSE_ID))
                .andExpect(status().isForbidden());

        verify(courseService, never()).delete(any());
    }

    // ── PUT /api/courses/{id} ─────────────────────────────────────────────────

    @Test
    @WithMockCollegeUser(role = "ADMIN")
    void updateCourse_validBody_returns200() throws Exception {
        when(courseService.update(eq(COURSE_ID), any())).thenReturn(aCourse());

        String body = json.writeValueAsString(Map.of(
                "code", "CS101",
                "name", "Updated Name",
                "credits", 4,
                "semester", 2
        ));

        mvc.perform(put("/api/courses/{id}", COURSE_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
