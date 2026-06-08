package com.college.finance.repository;

import com.college.finance.model.PaymentReceipt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PaymentReceiptRepository extends JpaRepository<PaymentReceipt, UUID> {
    List<PaymentReceipt> findByStudentIdOrderByPaidAtDesc(UUID studentId);
}
