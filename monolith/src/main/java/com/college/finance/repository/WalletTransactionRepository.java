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

    @Query(value = "SELECT COALESCE(t.balance_after, 0) FROM finance.wallet_transactions t WHERE t.student_id = :sid ORDER BY t.created_at DESC LIMIT 1", nativeQuery = true)
    BigDecimal findCurrentBalance(@Param("sid") UUID studentId);
}
