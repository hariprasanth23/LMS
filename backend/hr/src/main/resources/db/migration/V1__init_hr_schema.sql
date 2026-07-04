-- HR Service — leave management + payroll

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Leave Management
CREATE TABLE leave_balances (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID        NOT NULL,
    leave_type  VARCHAR(10) NOT NULL CHECK (leave_type IN ('CL','SL','EL','ML','COL')),
    total_days  INT         NOT NULL DEFAULT 0,
    used_days   INT         NOT NULL DEFAULT 0,
    balance     INT         GENERATED ALWAYS AS (total_days - used_days) STORED,
    year        INT         NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    UNIQUE(employee_id, leave_type, year)
);

CREATE TABLE leave_requests (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id  UUID        NOT NULL,
    leave_type   VARCHAR(10) NOT NULL,
    from_date    DATE        NOT NULL,
    to_date      DATE        NOT NULL,
    reason       TEXT,
    status       VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','REJECTED')),
    reviewed_by  UUID,
    review_note  TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payroll
CREATE TABLE payroll_records (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id  UUID          NOT NULL,
    month        INT           NOT NULL CHECK (month BETWEEN 1 AND 12),
    year         INT           NOT NULL,
    base_salary  NUMERIC(12,2) NOT NULL,
    allowance    NUMERIC(12,2) NOT NULL DEFAULT 0,
    deduction    NUMERIC(12,2) NOT NULL DEFAULT 0,
    bonus        NUMERIC(12,2) NOT NULL DEFAULT 0,
    net_salary   NUMERIC(12,2) GENERATED ALWAYS AS (base_salary + allowance + bonus - deduction) STORED,
    status       VARCHAR(20)   NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','PROCESSED')),
    created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    UNIQUE(employee_id, month, year)
);

CREATE INDEX idx_leave_requests_employee ON leave_requests(employee_id);
CREATE INDEX idx_payroll_employee ON payroll_records(employee_id);
