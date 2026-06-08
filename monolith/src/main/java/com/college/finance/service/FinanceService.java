package com.college.finance.service;

import com.college.auth.model.User;
import com.college.finance.model.*;
import com.college.finance.repository.*;
import com.college.student.model.Student;
import com.college.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class FinanceService {

    private final FeeRecordRepository feeRepo;
    private final PaymentReceiptRepository receiptRepo;
    private final WalletTransactionRepository walletRepo;
    private final RefundRequestRepository refundRepo;
    private final StudentRepository studentRepo;

    private Student getStudentOrThrow(User user) {
        return studentRepo.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException("Student profile not found"));
    }

    // ── Fees ──────────────────────────────────────────────────────────────────────

    public List<FeeRecord> getFees(User user) {
        Student s = getStudentOrThrow(user);
        return feeRepo.findByStudentIdOrderByDueDateAsc(s.getId());
    }

    // ── Receipts ──────────────────────────────────────────────────────────────────

    public List<PaymentReceipt> getReceipts(User user) {
        Student s = getStudentOrThrow(user);
        return receiptRepo.findByStudentIdOrderByPaidAtDesc(s.getId());
    }

    // ── Wallet ────────────────────────────────────────────────────────────────────

    public Map<String, Object> getWallet(User user) {
        Student s = getStudentOrThrow(user);
        BigDecimal balance = walletRepo.findCurrentBalance(s.getId());
        List<WalletTransaction> txns = walletRepo.findByStudentIdOrderByCreatedAtDesc(s.getId());
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("balance", balance != null ? balance : BigDecimal.ZERO);
        result.put("transactions", txns);
        return result;
    }

    public WalletTransaction addToWallet(User user, BigDecimal amount, String mode) {
        Student s = getStudentOrThrow(user);
        BigDecimal current = walletRepo.findCurrentBalance(s.getId());
        if (current == null) current = BigDecimal.ZERO;
        BigDecimal newBalance = current.add(amount);
        return walletRepo.save(WalletTransaction.builder()
                .studentId(s.getId()).type("Credit").amount(amount)
                .mode(mode).balanceAfter(newBalance).build());
    }

    // ── Refund ────────────────────────────────────────────────────────────────────

    public List<RefundRequest> getRefunds(User user) {
        Student s = getStudentOrThrow(user);
        return refundRepo.findByStudentIdOrderByRequestedAtDesc(s.getId());
    }

    public RefundRequest submitRefund(User user, String feeType, String reason, BigDecimal amount, String description) {
        Student s = getStudentOrThrow(user);
        String reqNum = "REF" + System.currentTimeMillis() % 100000;
        return refundRepo.save(RefundRequest.builder()
                .studentId(s.getId()).requestNumber(reqNum)
                .feeType(feeType).reason(reason).amount(amount)
                .description(description).status("Under Review").build());
    }
}
