-- Research Service

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE research_profiles (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id    UUID         NOT NULL UNIQUE,
    research_topic VARCHAR(255) NOT NULL,
    advisor_id    UUID,
    start_date    DATE,
    status        VARCHAR(20)  NOT NULL DEFAULT 'ONGOING',
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE weekly_logs (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    research_id    UUID        NOT NULL REFERENCES research_profiles(id) ON DELETE CASCADE,
    week_number    INT         NOT NULL,
    hours_worked   INT,
    work_summary   TEXT,
    submitted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(research_id, week_number)
);
