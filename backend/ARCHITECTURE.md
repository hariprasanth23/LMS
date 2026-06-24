# Architecture Decisions — LMS v2.0

## Domain Boundaries

Every microservice maps to a **bounded context** — a domain where a team can own the data model, the logic, and the deployment independently.

### Why these 12 services (not 15)?

The v1 monolith has 15 packages. Some are combined in v2.0 to avoid chatty cross-service calls:

| Monolith packages | Combined into | Reason |
|---|---|---|
| `student` + `employee` | `user-service` | Both are "person" entities; combining reduces Feign calls for profile lookups |
| `leave` + `payroll` | `hr-service` | Payroll generation reads leave data; coupling within HR boundary is acceptable |
| `lms` (courses/assignments/quizzes) | `course-service` | All course-lifecycle entities; splitting would require 3-hop calls for assignment submissions |

The rest map 1:1 to microservices.

---

## Data Isolation

### Database-per-Service

Each service has its own PostgreSQL database. This enforces true isolation:

- Schema changes in `lms_course_db` cannot break `lms_exam_db`
- Each service can evolve its schema independently with Flyway
- Services can be scaled to separate RDS instances if needed without code changes

### Cross-Service Data References (no shared FKs)

Services store only the **UUID** of entities that belong to another service:

```java
// In course-service: AssignmentSubmission entity
@Column(name = "student_id")   UUID studentId;   // lives in user-service
@Column(name = "assignment_id") UUID assignmentId; // lives in same DB
```

When the full student record is needed (e.g., for a grade report), `course-service` calls `user-service` via Feign:

```java
@FeignClient(name = "user-service", url = "${services.user-service.url}")
public interface UserServiceClient {
    @GetMapping("/internal/students/{id}")
    StudentDto getStudent(@PathVariable UUID id);
}
```

The `/internal/*` prefix marks endpoints intended only for service-to-service calls — the API Gateway blocks these from external clients.

---

## API Gateway Design

The `api-gateway` service (Spring Cloud Gateway) is the single entry point.

### What the gateway does
- **JWT validation** — validates signature and expiry on every request
- **Header injection** — extracts `userId` and `role` from JWT, adds `X-User-Id` and `X-User-Role` headers
- **Routing** — maps URL prefixes to downstream services
- **Rate limiting** — per-IP limits on auth endpoints via Redis
- **CORS** — single centralized CORS config

### What the gateway does NOT do
- Business logic
- Data transformation
- Aggregation (no BFF pattern here — frontend calls individual services when needed)

### Route Table

```yaml
# api-gateway/src/main/resources/application.yml
spring:
  cloud:
    gateway:
      routes:
        - id: auth-service
          uri: http://auth-service.lms.local:8081
          predicates:
            - Path=/api/auth/**
        - id: user-service
          uri: http://user-service.lms.local:8082
          predicates:
            - Path=/api/students/**, /api/employees/**, /api/departments/**
        - id: course-service
          uri: http://course-service.lms.local:8083
          predicates:
            - Path=/api/courses/**, /api/assignments/**, /api/quizzes/**, /api/announcements/**, /api/enrollments/**
        - id: examination-service
          uri: http://examination-service.lms.local:8084
          predicates:
            - Path=/api/examination/**
        - id: attendance-service
          uri: http://attendance-service.lms.local:8085
          predicates:
            - Path=/api/attendance/**
        - id: finance-service
          uri: http://finance-service.lms.local:8086
          predicates:
            - Path=/api/finance/**
        - id: hr-service
          uri: http://hr-service.lms.local:8087
          predicates:
            - Path=/api/leaves/**, /api/payroll/**
        - id: notification-service
          uri: http://notification-service.lms.local:8088
          predicates:
            - Path=/api/notifications/**
        - id: academics-service
          uri: http://academics-service.lms.local:8089
          predicates:
            - Path=/api/academics/**
        - id: feedback-service
          uri: http://feedback-service.lms.local:8090
          predicates:
            - Path=/api/feedback/**
        - id: research-service
          uri: http://research-service.lms.local:8091
          predicates:
            - Path=/api/research/**
        - id: student-services
          uri: http://student-services.lms.local:8092
          predicates:
            - Path=/api/services/**
```

Service URLs use AWS Cloud Map DNS (`service-name.lms.local`) — no hardcoded IPs.

---

## Security Architecture

### JWT in httpOnly Cookies (fixes v1 XSS vulnerability)

v1 stored JWT in `localStorage` — vulnerable to XSS. v2.0 stores the token in an `httpOnly` cookie:

```java
// auth-service: after login
ResponseCookie cookie = ResponseCookie.from("lms_token", jwt)
    .httpOnly(true)
    .secure(true)        // HTTPS only
    .sameSite("Strict")  // CSRF protection
    .maxAge(Duration.ofHours(24))
    .path("/")
    .build();
response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
```

The API Gateway reads the cookie from the request, not the `Authorization: Bearer` header.

### Per-Service IAM Task Roles

Each ECS task gets a unique IAM role with only the permissions it needs:

```
auth-service task role:
  - secretsmanager:GetSecretValue (/lms/prod/auth-service-db, /lms/prod/jwt-secret)
  - logs:CreateLogStream, logs:PutLogEvents (/ecs/lms/auth-service)

finance-service task role:
  - secretsmanager:GetSecretValue (/lms/prod/finance-service-db, /lms/prod/ses)
  - sqs:SendMessage (lms-payment-done.fifo)
  - ses:SendEmail (from lms.yourdomain.com)
  - s3:GetObject, s3:PutObject (lms-files-prod/finance/*)
```

No service has `s3:*` or `sqs:*` wildcard permissions.

---

## Event-Driven Notifications

Notification delivery is fully async. Services publish events to SQS; `notification-service` consumes them and delivers in-app notifications + emails.

```
finance-service
  → SQS: lms-payment-done
      { userId, amount, feeType, transactionId }

notification-service (consumer)
  ← reads from lms-payment-done
  → creates Notification record in lms_notification_db
  → sends email via SES ("Your payment of ₹X was successful")
```

This decoupling means:
- `finance-service` does not import `notification-service` — no circular dependency
- If email delivery fails, the SQS message is retried (up to 3 times), then moved to DLQ
- Notification logic can change without redeploying `finance-service`

---

## Flyway Migration Strategy

Every service ships with Flyway migrations in `src/main/resources/db/migration/`:

```
V1__init_schema.sql          ← baseline schema
V2__add_refresh_tokens.sql   ← additive change
V3__index_email.sql          ← performance index
```

Rules:
- **Never edit an existing migration file** once it's been applied
- All schema changes go in new versioned files
- CI runs `./gradlew flywayValidate` before deploying to catch drift
- Staging runs migrations automatically on startup; production requires manual approval

---

## Observability Stack

### Correlation IDs

Every request gets a `traceId` (UUID) at the gateway. It's passed in headers (`X-Trace-Id`) to all downstream services and included in every log line via MDC:

```java
// In each service: MdcCorrelationFilter.java
MDC.put("traceId", request.getHeader("X-Trace-Id"));
```

Log format (JSON, parsed by CloudWatch Logs Insights):

```json
{
  "timestamp": "2025-01-15T10:30:00.000Z",
  "level": "INFO",
  "service": "auth-service",
  "traceId": "abc-123-xyz",
  "userId": "uuid",
  "message": "User login successful",
  "duration_ms": 45
}
```

### Health Checks

Every service exposes `/actuator/health` (public, no auth). ECS uses this as the container health check. The ALB target group health check also hits this endpoint.

---

## Frontend Changes from v1

The React SPA is almost identical to v1 — the key changes are:

1. **Single gateway URL** — `api.js` still points to one base URL (the API Gateway, not individual services)
2. **httpOnly cookies** — `withCredentials: true` is already set in `api.js`; no localStorage JWT storage
3. **No proxy** — In production, the frontend is on CloudFront and makes CORS requests to `api.lms.yourdomain.com`
4. **Vite proxy** in local dev still works: `/api → localhost:8080 (api-gateway)`
