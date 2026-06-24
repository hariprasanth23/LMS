-- V3 — ShedLock distributed-lock table.
-- One row per @SchedulerLock name; ShedLock takes the row via FOR UPDATE
-- before allowing the @Scheduled method to run.

CREATE TABLE shedlock (
    name        VARCHAR(64) PRIMARY KEY,
    lock_until  TIMESTAMPTZ NOT NULL,
    locked_at   TIMESTAMPTZ NOT NULL,
    locked_by   VARCHAR(255) NOT NULL
);
