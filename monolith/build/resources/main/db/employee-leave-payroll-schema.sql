-- ============================================================
-- Employee, Leave, and Payroll schema tables
-- Run after schema-setup.sql (schemas must exist)
-- ============================================================

-- ---- employee schema ----

CREATE TABLE IF NOT EXISTS employee.employees (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID,
    emp_code        VARCHAR(20) NOT NULL UNIQUE,
    name            VARCHAR(150) NOT NULL,
    email           VARCHAR(150),
    phone           VARCHAR(20),
    department_id   BIGINT,
    designation     VARCHAR(100),
    employee_type   VARCHAR(20),
    join_date       DATE,
    base_salary     NUMERIC(12, 2),
    status          VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    qualifications  TEXT,
    created_at      TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employee.employee_documents (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id     UUID        NOT NULL REFERENCES employee.employees(id) ON DELETE CASCADE,
    doc_type        VARCHAR(50),
    doc_url         TEXT,
    uploaded_at     TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ---- leave_mgmt schema ----

CREATE TABLE IF NOT EXISTS leave_mgmt.leave_requests (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id     UUID        NOT NULL,
    leave_type      VARCHAR(30),
    from_date       DATE,
    to_date         DATE,
    reason          TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    reviewed_by     UUID,
    review_note     TEXT,
    created_at      TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leave_mgmt.leave_balances (
    id              BIGSERIAL   PRIMARY KEY,
    employee_id     UUID        NOT NULL UNIQUE,
    casual_balance  INT         NOT NULL DEFAULT 12,
    sick_balance    INT         NOT NULL DEFAULT 10,
    earned_balance  INT         NOT NULL DEFAULT 15,
    year            INT         NOT NULL
);

-- ---- payroll schema ----

CREATE TABLE IF NOT EXISTS payroll.payroll_records (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id         UUID        NOT NULL,
    month               INT         NOT NULL CHECK (month BETWEEN 1 AND 12),
    year                INT         NOT NULL,
    base_salary         NUMERIC(12, 2),
    allowances          NUMERIC(12, 2) NOT NULL DEFAULT 0,
    deductions          NUMERIC(12, 2) NOT NULL DEFAULT 0,
    leave_deductions    NUMERIC(12, 2) NOT NULL DEFAULT 0,
    net_salary          NUMERIC(12, 2),
    status              VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    processed_at        TIMESTAMP,
    remarks             TEXT,
    created_at          TIMESTAMP   NOT NULL DEFAULT NOW(),
    UNIQUE (employee_id, month, year)
);
