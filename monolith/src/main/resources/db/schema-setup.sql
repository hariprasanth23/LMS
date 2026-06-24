-- College Management System — Schema Setup
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS student;
CREATE SCHEMA IF NOT EXISTS lms;
CREATE SCHEMA IF NOT EXISTS employee;
CREATE SCHEMA IF NOT EXISTS attendance;
CREATE SCHEMA IF NOT EXISTS leave_mgmt;
CREATE SCHEMA IF NOT EXISTS payroll;
CREATE SCHEMA IF NOT EXISTS notification;
CREATE SCHEMA IF NOT EXISTS examination;
CREATE SCHEMA IF NOT EXISTS feedback;
CREATE SCHEMA IF NOT EXISTS finance;
CREATE SCHEMA IF NOT EXISTS services;
CREATE SCHEMA IF NOT EXISTS research;

-- ── Performance indexes ─────────────────────────────────────────────────────
-- Wallet balance lookup: WalletTransactionRepository.findCurrentBalance() runs
-- `ORDER BY created_at DESC LIMIT 1` filtered by student_id. Without this
-- composite index it scans every row in finance.wallet_transactions on every
-- call. The IF EXISTS guard + IF NOT EXISTS make this safe to re-run on every
-- startup (spring.sql.init.mode = always) — the index only gets created after
-- Hibernate creates the table.

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'finance' AND table_name = 'wallet_transactions'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_wallet_txn_student_created
            ON finance.wallet_transactions (student_id, created_at DESC);
    END IF;
END $$;
