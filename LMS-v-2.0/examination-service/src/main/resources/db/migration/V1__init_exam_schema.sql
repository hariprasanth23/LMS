-- Examination Service — exam schedules, marks, grades, arrears, makeup

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE exam_schedule (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_code     VARCHAR(20)  NOT NULL,
    course_name     VARCHAR(255) NOT NULL,
    exam_date       DATE         NOT NULL,
    time_slot       VARCHAR(50),
    venue           VARCHAR(100),
    exam_type       VARCHAR(30),
    semester        INT,
    batch           VARCHAR(20),
    department_code VARCHAR(20),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE internal_marks (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID        NOT NULL,
    course_id  UUID        NOT NULL,
    marks      NUMERIC(5,2),
    max_marks  NUMERIC(5,2) NOT NULL DEFAULT 100,
    exam_type  VARCHAR(30),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE(student_id, course_id, exam_type)
);

CREATE TABLE semester_grades (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id   UUID        NOT NULL,
    semester     INT         NOT NULL,
    gpa          NUMERIC(4,2),
    grade_points NUMERIC(5,2),
    credits      INT,
    status       VARCHAR(20),
    academic_year VARCHAR(10),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(student_id, semester, academic_year)
);

CREATE TABLE arrear_registrations (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id        UUID        NOT NULL,
    course_code       VARCHAR(20) NOT NULL,
    registration_date DATE        NOT NULL DEFAULT CURRENT_DATE,
    status            VARCHAR(20) NOT NULL DEFAULT 'REGISTERED',
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE makeup_exam_applications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id  UUID        NOT NULL,
    course_id   UUID        NOT NULL,
    reason      TEXT,
    status      VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE scheduled_online_exams (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id       UUID        NOT NULL,
    exam_date        TIMESTAMPTZ NOT NULL,
    course_id        UUID,
    duration_minutes INT,
    status           VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_internal_marks_student ON internal_marks(student_id);
CREATE INDEX idx_semester_grades_student ON semester_grades(student_id);
