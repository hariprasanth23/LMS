-- Creates all 12 service databases on first Postgres startup
-- This file is mounted as a Docker init script

CREATE DATABASE lms_auth_db;
CREATE DATABASE lms_user_db;
CREATE DATABASE lms_course_db;
CREATE DATABASE lms_exam_db;
CREATE DATABASE lms_attendance_db;
CREATE DATABASE lms_finance_db;
CREATE DATABASE lms_hr_db;
CREATE DATABASE lms_notification_db;
CREATE DATABASE lms_academics_db;
CREATE DATABASE lms_feedback_db;
CREATE DATABASE lms_research_db;
CREATE DATABASE lms_services_db;
