package com.lms.finance.repository;

import com.lms.finance.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/** Bundle of finance repositories — five tables, all keyed by student_id. */
public class FinanceRepositories {

    @Repository
    public interface FeeRecordRepository extends JpaRepository<FeeRecord, UUID> {
        List<FeeRecord> findByStudentIdOrderByDueDateAsc(UUID studentId);
    }

    @Repository
    public interface PaymentReceiptRepository extends JpaRepository<PaymentReceipt, UUID> {
        List<PaymentReceipt> findByStudentIdOrderByPaidAtDesc(UUID studentId);
    }

    @Repository
    public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, UUID> {
        List<WalletTransaction> findByStudentIdOrderByCreatedAtDesc(UUID studentId);

        @Query(value = """
            SELECT COALESCE(SUM(CASE WHEN type = 'CREDIT' THEN amount ELSE -amount END), 0)
            FROM wallet_transactions WHERE student_id = :sid
            """, nativeQuery = true)
        BigDecimal currentBalance(@Param("sid") UUID studentId);
    }

    @Repository
    public interface RefundRequestRepository extends JpaRepository<RefundRequest, UUID> {
        List<RefundRequest> findByStudentIdOrderByCreatedAtDesc(UUID studentId);
    }
}
