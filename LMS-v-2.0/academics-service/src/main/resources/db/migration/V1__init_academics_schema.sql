-- Academics Service — MOOC, ECC, internship, conference, projects, wishlist

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE course_wishlists (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id  UUID        NOT NULL,
    course_code VARCHAR(20) NOT NULL,
    added_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(student_id, course_code)
);

CREATE TABLE exc_registrations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID        NOT NULL,
    activity_name   VARCHAR(255) NOT NULL,
    activity_type   VARCHAR(50),
    registered_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status          VARCHAR(20) NOT NULL DEFAULT 'REGISTERED'
);

CREATE TABLE mooc_submissions (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id   UUID         NOT NULL,
    course_name  VARCHAR(255) NOT NULL,
    platform     VARCHAR(100),
    duration     VARCHAR(50),
    certificate_url TEXT,
    submitted_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    status       VARCHAR(20)  NOT NULL DEFAULT 'PENDING'
);

CREATE TABLE internship_registrations (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id   UUID         NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    role         VARCHAR(100),
    start_date   DATE,
    end_date     DATE,
    stipend      NUMERIC(10,2),
    status       VARCHAR(20)  NOT NULL DEFAULT 'REGISTERED',
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE conference_registrations (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id       UUID         NOT NULL,
    conference_name  VARCHAR(255) NOT NULL,
    organizer        VARCHAR(255),
    conference_date  DATE,
    paper_title      VARCHAR(255),
    status           VARCHAR(20)  NOT NULL DEFAULT 'REGISTERED',
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE project_applications (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id     UUID         NOT NULL,
    project_title  VARCHAR(255) NOT NULL,
    supervisor_id  UUID,
    description    TEXT,
    status         VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    applied_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mooc_student ON mooc_submissions(student_id);
CREATE INDEX idx_internship_student ON internship_registrations(student_id);
