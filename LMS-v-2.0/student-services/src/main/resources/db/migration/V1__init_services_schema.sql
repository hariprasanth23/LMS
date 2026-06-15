-- Student Services — bonafide, library, health feedback, service requests

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE bonafide_applications (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id   UUID         NOT NULL,
    purpose      VARCHAR(255) NOT NULL,
    addressed_to VARCHAR(255),
    language     VARCHAR(30)  NOT NULL DEFAULT 'ENGLISH',
    copies       INT          NOT NULL DEFAULT 1,
    urgency      VARCHAR(20)  NOT NULL DEFAULT 'NORMAL',
    status       VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    issued_date  DATE,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE library_books (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title             VARCHAR(255) NOT NULL,
    author            VARCHAR(255),
    isbn              VARCHAR(20),
    call_number       VARCHAR(50),
    availability_status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    issued_to_student UUID,
    due_date          DATE,
    added_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE book_recommendations (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id  UUID         NOT NULL,
    book_title  VARCHAR(255) NOT NULL,
    author      VARCHAR(255),
    publisher   VARCHAR(255),
    isbn        VARCHAR(20),
    category    VARCHAR(50),
    reason      TEXT,
    status      VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE student_service_requests (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id     UUID         NOT NULL,
    request_type   VARCHAR(50)  NOT NULL,
    request_number VARCHAR(30)  UNIQUE,
    details        TEXT,
    status         VARCHAR(20)  NOT NULL DEFAULT 'OPEN',
    submitted_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE health_feedback (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID,
    visit_reason      VARCHAR(255),
    doctor_rating     INT CHECK (doctor_rating BETWEEN 1 AND 5),
    facility_rating   INT CHECK (facility_rating BETWEEN 1 AND 5),
    wait_time_rating  INT CHECK (wait_time_rating BETWEEN 1 AND 5),
    comments          TEXT,
    is_anonymous      BOOLEAN      NOT NULL DEFAULT false,
    submitted_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
