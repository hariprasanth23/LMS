package com.college.services.service;

import com.college.auth.model.User;
import com.college.services.model.BonafideApplication;
import com.college.services.model.BookRecommendation;
import com.college.services.model.LibraryBook;
import com.college.services.repository.BonafideRepository;
import com.college.services.repository.BookRecommendationRepository;
import com.college.services.repository.LibraryBookRepository;
import com.college.student.model.Student;
import com.college.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ServicesService {

    private final BonafideRepository bonafideRepo;
    private final LibraryBookRepository libraryBookRepo;
    private final BookRecommendationRepository recommendationRepo;
    private final StudentRepository studentRepo;

    private Student getStudentOrThrow(User user) {
        return studentRepo.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException("Student profile not found"));
    }

    // ── Bonafide ──────────────────────────────────────────────────────────────────

    public List<BonafideApplication> getBonafideApplications(User user) {
        Student s = getStudentOrThrow(user);
        return bonafideRepo.findByStudentIdOrderByAppliedAtDesc(s.getId());
    }

    public BonafideApplication applyBonafide(User user, String purpose, String addressedTo,
                                              String description, String language, Integer copies, String urgency) {
        Student s = getStudentOrThrow(user);
        String appNum = "BON" + System.currentTimeMillis() % 1000000;
        return bonafideRepo.save(BonafideApplication.builder()
                .studentId(s.getId()).applicationNumber(appNum)
                .purpose(purpose).addressedTo(addressedTo).description(description)
                .language(language != null ? language : "English")
                .copies(copies != null ? copies : 1)
                .urgency(urgency != null ? urgency : "Normal")
                .status("Processing").build());
    }

    // ── Library – issued books ────────────────────────────────────────────────────

    public List<LibraryBook> getIssuedBooks(User user) {
        Student s = getStudentOrThrow(user);
        return libraryBookRepo.findByStudentIdAndReturnedFalse(s.getId());
    }

    public LibraryBook renewBook(User user, UUID bookId) {
        LibraryBook book = libraryBookRepo.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));
        Student s = getStudentOrThrow(user);
        if (!book.getStudentId().equals(s.getId()))
            throw new IllegalArgumentException("Not your book");
        if (book.getRenewalsUsed() >= book.getMaxRenewals())
            throw new IllegalStateException("No renewals left");
        book.setRenewalsUsed(book.getRenewalsUsed() + 1);
        book.setDueDate(book.getDueDate().plusDays(21));
        return libraryBookRepo.save(book);
    }

    // ── Library – recommendations ─────────────────────────────────────────────────

    public List<BookRecommendation> getRecommendations(User user) {
        Student s = getStudentOrThrow(user);
        return recommendationRepo.findByStudentIdOrderBySubmittedAtDesc(s.getId());
    }

    public BookRecommendation recommendBook(User user, String title, String author,
                                            String publisher, String isbn, String category, String reason) {
        Student s = getStudentOrThrow(user);
        return recommendationRepo.save(BookRecommendation.builder()
                .studentId(s.getId()).title(title).author(author)
                .publisher(publisher).isbn(isbn).category(category).reason(reason)
                .status("Pending").build());
    }

    // ── Library stats ─────────────────────────────────────────────────────────────

    public Map<String, Object> getLibraryStats(User user) {
        Student s = getStudentOrThrow(user);
        long totalBorrowed = libraryBookRepo.countByStudentId(s.getId());
        long totalRecommendations = recommendationRepo.findByStudentIdOrderBySubmittedAtDesc(s.getId()).size();
        long overdue = libraryBookRepo.findByStudentIdAndReturnedFalse(s.getId())
                .stream().filter(b -> b.getDueDate() != null && b.getDueDate().isBefore(LocalDate.now())).count();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("booksBorrowed", totalBorrowed);
        result.put("overdueCount", overdue);
        result.put("recommendations", totalRecommendations);
        return result;
    }
}
