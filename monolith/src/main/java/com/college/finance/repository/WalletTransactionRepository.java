package com.college.finance.repository;

import com.college.finance.model.WalletTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, UUID> {
    List<WalletTransaction> findByStudentIdOrderByCreatedAtDesc(UUID studentId);

    @Query("SELECT COALESCE(MAX(t.balanceAfter), 0) FROM WalletTransaction t WHERE t.studentId = :sid ORDER BY t.createdAt DESC")
    BigDecimal findCurrentBalance(@Param("sid") UUID studentId);
}
