-- Attendance Service

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE student_attendance (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID        NOT NULL,
    course_id  UUID        NOT NULL,
    date       DATE        NOT NULL,
    status     VARCHAR(10) NOT NULL CHECK (status IN ('PRESENT','ABSENT','LATE')),
    marked_by  UUID,
    marked_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(student_id, course_id, date)
);

CREATE TABLE employee_attendance (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID        NOT NULL,
    date        DATE        NOT NULL,
    status      VARCHAR(10) NOT NULL CHECK (status IN ('PRESENT','ABSENT','HALF_DAY','ON_LEAVE')),
    check_in    TIME,
    check_out   TIME,
    marked_by   UUID,
    marked_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(employee_id, date)
);

CREATE INDEX idx_student_attendance_student ON student_attendance(student_id);
CREATE INDEX idx_student_attendance_course ON student_attendance(course_id);
CREATE INDEX idx_student_attendance_date ON student_attendance(date);
CREATE INDEX idx_employee_attendance_employee ON employee_attendance(employee_id);
