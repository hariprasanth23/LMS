# Migration Guide — LMS v1 (Monolith) → v2.0 (Microservices)

## Strategy: Strangler Fig Pattern

We don't rewrite everything at once. Instead, extract services one at a time while the monolith continues running. Each extracted service takes over its API paths via the API Gateway.

```
Phase 1: Gateway in front of monolith (no services extracted yet)
         Client → api-gateway → monolith (all traffic)

Phase 2: auth-service extracted
         Client → api-gateway → auth-service  (/api/auth/**)
                              → monolith      (everything else)

Phase 3: user-service extracted
         Client → api-gateway → auth-service  (/api/auth/**)
                              → user-service  (/api/students/**, /api/employees/**)
                              → monolith      (everything else)

... continue until monolith handles zero traffic, then decommission
```

---

## Phase 1 — API Gateway in Front of Monolith

**Goal:** Deploy the API Gateway pointing all traffic to the existing monolith. No functional change.

**Steps:**
1. Deploy `api-gateway` service on ECS pointing to the monolith URL
2. Update DNS: `api.lms.yourdomain.com` → ALB → api-gateway → monolith
3. Verify all endpoints still work end-to-end
4. Frontend updated to use `api.lms.yourdomain.com` instead of direct backend URL

**Risk:** Low — monolith is unchanged, gateway is pass-through.

---

## Phase 2 — Extract auth-service

**Goal:** `auth-service` handles all `/api/auth/**` endpoints. Monolith handles everything else.

**Steps:**
1. Create `lms_auth_db` on RDS
2. Export auth data from monolith DB:
   ```sql
   -- Export users from monolith
   \COPY (SELECT * FROM auth.users) TO '/tmp/users.csv' CSV HEADER;
   \COPY (SELECT * FROM auth.refresh_tokens) TO '/tmp/refresh_tokens.csv' CSV HEADER;
   ```
3. Import into `lms_auth_db` (same schema, Flyway V1 creates it first)
4. Deploy `auth-service` on ECS
5. Update API Gateway: route `/api/auth/**` → auth-service
6. Run integration tests: login, register, JWT validation
7. Remove auth package from monolith deployment (keep code until stable)

**Migration script:** `infra/aws/scripts/migrate-auth.sh`

**Rollback:** Update gateway route back to monolith; data stays in both DBs temporarily.

---

## Phase 3 — Extract user-service

**Goal:** `user-service` handles students, employees, departments.

**Dependencies to resolve before extracting:**
- Monolith's `AcademicsService` calls `StudentRepository` — must switch to Feign call
- Monolith's `ExaminationService` calls `StudentRepository` — must switch to Feign call
- Monolith's `LeaveService` calls `EmployeeRepository` — must switch to Feign call
- Monolith's `PayrollService` calls `EmployeeRepository` — must switch to Feign call

**Steps:**
1. In the remaining monolith code, replace direct repo calls with Feign calls to `user-service`
2. Create `lms_user_db`, run Flyway V1 migration
3. Export and import student/employee/department data
4. Deploy `user-service`, update gateway routes
5. Regression test all flows that touch student/employee data

---

## Phase 4 — Extract course-service and examination-service

These are the largest services. Extract together since examination reads course data.

**Steps:**
1. Resolve enrollment cross-reference: `user-service` stores `studentId`, `course-service` stores the enrollment link
2. Create `lms_course_db`, `lms_exam_db`
3. Export LMS + examination data from monolith
4. Deploy both services
5. Wire `examination-service` → `course-service` Feign client for course lookups
6. Wire `course-service` → `user-service` Feign client for student lookups

---

## Phase 5 — Extract finance-service and hr-service

**Caution:** Financial data requires zero data loss. Use this sequence:
1. Dual-write period: monolith writes to both old DB and new `lms_finance_db`
2. Verify data parity between the two for 48 hours
3. Cut over gateway route
4. Stop monolith writes to finance tables

---

## Phase 6 — Extract remaining services

These are lower-risk services with fewer cross-domain dependencies:
- attendance-service
- notification-service
- academics-service
- feedback-service
- research-service
- student-services

Extract one per sprint, verify, then proceed.

---

## Phase 7 — Decommission Monolith

Once the API Gateway routes zero traffic to the monolith:
1. Reduce monolith ECS tasks to 0 (don't delete yet)
2. Monitor for 2 weeks
3. Archive monolith codebase tag: `git tag monolith-final-<date>`
4. Delete monolith ECS service and RDS `lms_db`

---

## Data Migration Checklist

For each service extraction:

```
[ ] Create target database on RDS
[ ] Run Flyway V1 migration to create schema
[ ] Export data from monolith PostgreSQL
[ ] Transform data if schema changed (UUIDs, column renames, etc.)
[ ] Import into target database
[ ] Verify row counts match
[ ] Verify foreign key integrity in new DB
[ ] Run smoke tests against new service
[ ] Enable dual-write (optional, for financial services)
[ ] Cut over API Gateway route
[ ] Monitor error rate for 24 hours
[ ] Remove dual-write if used
```

---

## Common Migration Pitfalls

| Pitfall | How to avoid |
|---|---|
| UUIDs vs Long IDs | v1 already uses UUIDs everywhere — no ID type migration needed |
| Cross-DB transactions | Replace with Saga pattern: compensating transactions via SQS events |
| Shared DB schema queries | These break immediately — find all cross-schema queries before extracting |
| N+1 Feign calls | Batch Feign endpoints: `GET /internal/students?ids=uuid1,uuid2,uuid3` |
| Session data in monolith | JWT is stateless — no session migration needed |
