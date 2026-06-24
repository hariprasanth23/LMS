-- User Service — students, employees, departments

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE departments (
    id               BIGSERIAL    PRIMARY KEY,
    name             VARCHAR(255) NOT NULL UNIQUE,
    code             VARCHAR(20)  NOT NULL UNIQUE,
    description      TEXT,
    head_faculty_id  UUID,
    email            VARCHAR(255),
    phone            VARCHAR(20),
    location         VARCHAR(255),
    established_year INT,
    total_seats      INT,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE students (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID         NOT NULL UNIQUE,
    roll_number             VARCHAR(50)  NOT NULL UNIQUE,
    department_id           BIGINT       NOT NULL REFERENCES departments(id),
    program                 VARCHAR(50)  NOT NULL,
    semester                INT          NOT NULL,
    section                 VARCHAR(10),
    batch                   VARCHAR(20)  NOT NULL,
    admission_year          INT          NOT NULL,
    join_date               DATE,
    status                  VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    date_of_birth           DATE,
    gender                  VARCHAR(10),
    blood_group             VARCHAR(5),
    category                VARCHAR(20),
    aadhaar_number          VARCHAR(20),
    address                 TEXT,
    father_name             VARCHAR(255),
    mother_name             VARCHAR(255),
    parent_phone            VARCHAR(20),
    guardian_name           VARCHAR(255),
    guardian_phone          VARCHAR(20),
    emergency_contact_name  VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    created_at              TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE student_bank_info (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id           UUID         NOT NULL UNIQUE REFERENCES students(id) ON DELETE CASCADE,
    account_holder_name  VARCHAR(255),
    bank_name            VARCHAR(255),
    account_number       VARCHAR(30),
    ifsc_code            VARCHAR(15),
    branch               VARCHAR(255),
    created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE employees (
    id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID         NOT NULL UNIQUE,
    emp_code       VARCHAR(30)  NOT NULL UNIQUE,
    name           VARCHAR(255) NOT NULL,
    email          VARCHAR(255) NOT NULL UNIQUE,
    phone          VARCHAR(20),
    department_id  BIGINT       NOT NULL REFERENCES departments(id),
    designation    VARCHAR(100),
    employee_type  VARCHAR(20)  NOT NULL CHECK (employee_type IN ('FACULTY','STAFF')),
    join_date      DATE,
    base_salary    NUMERIC(12,2),
    status         VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    qualifications TEXT,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE employee_documents (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID        NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    doc_type    VARCHAR(50) NOT NULL,
    doc_url     TEXT        NOT NULL,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_students_department ON students(department_id);
CREATE INDEX idx_students_roll_number ON students(roll_number);
CREATE INDEX idx_employees_department ON employees(department_id);
