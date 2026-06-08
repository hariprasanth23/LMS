package com.college.services.repository;

import com.college.services.model.LibraryBook;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LibraryBookRepository extends JpaRepository<LibraryBook, UUID> {
    List<LibraryBook> findByStudentIdAndReturnedFalse(UUID studentId);
    long countByStudentId(UUID studentId);
}
