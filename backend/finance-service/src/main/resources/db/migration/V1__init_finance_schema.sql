-- Finance Service — fees, payments, wallet, refunds

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE fee_records (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id    UUID         NOT NULL,
    fee_type      VARCHAR(50)  NOT NULL,
    amount        NUMERIC(12,2) NOT NULL,
    due_date      DATE,
    status        VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    academic_year VARCHAR(10),
    semester      INT,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE payment_receipts (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id     UUID          NOT NULL,
    fee_record_id  UUID          REFERENCES fee_records(id),
    amount_paid    NUMERIC(12,2) NOT NULL,
    payment_method VARCHAR(30),
    transaction_id VARCHAR(100),
    paid_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE wallet_transactions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id  UUID          NOT NULL,
    type        VARCHAR(10)   NOT NULL CHECK (type IN ('CREDIT','DEBIT')),
    amount      NUMERIC(12,2) NOT NULL,
    description VARCHAR(255),
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE refund_requests (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id  UUID        NOT NULL,
    amount      NUMERIC(12,2) NOT NULL,
    reason      TEXT,
    status      VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fee_records_student ON fee_records(student_id);
CREATE INDEX idx_wallet_transactions_student ON wallet_transactions(student_id);
