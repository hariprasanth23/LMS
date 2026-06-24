-- Feedback Service

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE course_feedback (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id   UUID        NOT NULL,
    course_id    UUID        NOT NULL,
    rating       INT         NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comments     TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(student_id, course_id)
);

CREATE TABLE feedback_247 (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id   UUID,
    category     VARCHAR(50),
    rating       INT         CHECK (rating BETWEEN 1 AND 5),
    comments     TEXT,
    is_anonymous BOOLEAN     NOT NULL DEFAULT false,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
