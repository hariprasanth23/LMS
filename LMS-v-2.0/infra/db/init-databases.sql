-- ─────────────────────────────────────────────────────────────────────────────
-- LMS v2.0 — Postgres bootstrap (single instance, 12 logical DBs)
--
-- Runs once on first container start via /docker-entrypoint-initdb.d/.
-- Creates per-service DBs **and** per-service roles so each service connects
-- with the principle of least privilege. The bootstrap superuser
-- (POSTGRES_USER) is still used for migrations and ops, but is NEVER used by
-- application services at runtime.
--
-- For local dev all passwords default to `changeme`. In production, rotate
-- via `ALTER ROLE … PASSWORD …` once and store in AWS Secrets Manager.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Roles (per-service) ─────────────────────────────────────────────────────

CREATE ROLE lms_auth_user          LOGIN PASSWORD 'changeme';
CREATE ROLE lms_user_user          LOGIN PASSWORD 'changeme';
CREATE ROLE lms_course_user        LOGIN PASSWORD 'changeme';
CREATE ROLE lms_exam_user          LOGIN PASSWORD 'changeme';
CREATE ROLE lms_attendance_user    LOGIN PASSWORD 'changeme';
CREATE ROLE lms_finance_user       LOGIN PASSWORD 'changeme';
CREATE ROLE lms_hr_user            LOGIN PASSWORD 'changeme';
CREATE ROLE lms_notification_user  LOGIN PASSWORD 'changeme';
CREATE ROLE lms_academics_user     LOGIN PASSWORD 'changeme';
CREATE ROLE lms_feedback_user      LOGIN PASSWORD 'changeme';
CREATE ROLE lms_research_user      LOGIN PASSWORD 'changeme';
CREATE ROLE lms_services_user      LOGIN PASSWORD 'changeme';

-- ── Databases (one per service, owned by per-service role) ──────────────────

CREATE DATABASE lms_auth_db         OWNER lms_auth_user;
CREATE DATABASE lms_user_db         OWNER lms_user_user;
CREATE DATABASE lms_course_db       OWNER lms_course_user;
CREATE DATABASE lms_exam_db         OWNER lms_exam_user;
CREATE DATABASE lms_attendance_db   OWNER lms_attendance_user;
CREATE DATABASE lms_finance_db      OWNER lms_finance_user;
CREATE DATABASE lms_hr_db           OWNER lms_hr_user;
CREATE DATABASE lms_notification_db OWNER lms_notification_user;
CREATE DATABASE lms_academics_db    OWNER lms_academics_user;
CREATE DATABASE lms_feedback_db     OWNER lms_feedback_user;
CREATE DATABASE lms_research_db     OWNER lms_research_user;
CREATE DATABASE lms_services_db     OWNER lms_services_user;

-- ── Revoke default PUBLIC connect, then grant per-service ───────────────────

REVOKE ALL ON DATABASE lms_auth_db,         lms_user_db,    lms_course_db,
                       lms_exam_db,         lms_attendance_db, lms_finance_db,
                       lms_hr_db,           lms_notification_db, lms_academics_db,
                       lms_feedback_db,     lms_research_db,  lms_services_db
FROM PUBLIC;

GRANT  ALL ON DATABASE lms_auth_db         TO lms_auth_user;
GRANT  ALL ON DATABASE lms_user_db         TO lms_user_user;
GRANT  ALL ON DATABASE lms_course_db       TO lms_course_user;
GRANT  ALL ON DATABASE lms_exam_db         TO lms_exam_user;
GRANT  ALL ON DATABASE lms_attendance_db   TO lms_attendance_user;
GRANT  ALL ON DATABASE lms_finance_db      TO lms_finance_user;
GRANT  ALL ON DATABASE lms_hr_db           TO lms_hr_user;
GRANT  ALL ON DATABASE lms_notification_db TO lms_notification_user;
GRANT  ALL ON DATABASE lms_academics_db    TO lms_academics_user;
GRANT  ALL ON DATABASE lms_feedback_db     TO lms_feedback_user;
GRANT  ALL ON DATABASE lms_research_db     TO lms_research_user;
GRANT  ALL ON DATABASE lms_services_db     TO lms_services_user;
