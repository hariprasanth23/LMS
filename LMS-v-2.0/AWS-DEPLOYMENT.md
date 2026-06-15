# AWS Deployment Game Plan — LMS v2.0

> **Goal:** Deploy all 12 microservices + frontend on AWS with zero server management,
> auto-scaling, high availability, and production-grade security.

---

## Table of Contents

- [AWS Services Used](#aws-services-used)
- [Architecture Diagram](#architecture-diagram)
- [Phase 1 — Foundation (VPC, RDS, ECR)](#phase-1--foundation-vpc-rds-ecr)
- [Phase 2 — Container Platform (ECS Fargate)](#phase-2--container-platform-ecs-fargate)
- [Phase 3 — API Gateway & Load Balancer](#phase-3--api-gateway--load-balancer)
- [Phase 4 — Messaging & Storage](#phase-4--messaging--storage)
- [Phase 5 — Frontend (CloudFront + S3)](#phase-5--frontend-cloudfront--s3)
- [Phase 6 — CI/CD Pipeline](#phase-6--cicd-pipeline)
- [Phase 7 — Observability](#phase-7--observability)
- [Security Checklist](#security-checklist)
- [Cost Estimate](#cost-estimate)
- [Environment Strategy](#environment-strategy)
- [Rollback Strategy](#rollback-strategy)

---

## AWS Services Used

| AWS Service | What it does in LMS v2.0 |
|---|---|
| **Amazon ECS Fargate** | Runs all 12 Spring Boot microservice containers (no EC2 to manage) |
| **Amazon ECR** | Private Docker image registry for all service images |
| **Amazon RDS PostgreSQL** | Managed databases — one RDS instance, 12 separate databases |
| **Application Load Balancer (ALB)** | HTTPS entry point, routes to API Gateway service on ECS |
| **Amazon CloudFront + S3** | Hosts and serves the React SPA with global CDN |
| **Amazon SQS** | Async message queues for cross-service events (enrolled, graded, etc.) |
| **Amazon SNS** | Fan-out for broadcast events (e.g., exam scheduled → notify all students) |
| **Amazon SES** | Transactional email (replaces SMTP in v1) |
| **Amazon S3** | File storage (assignment submissions, course materials, profile photos) |
| **AWS Secrets Manager** | Stores DB passwords, JWT secret, SES keys — injected at runtime |
| **AWS Certificate Manager** | Free TLS cert for your domain (used by ALB + CloudFront) |
| **Amazon Route 53** | DNS management (`lms.yourdomain.com` → ALB, `cdn.yourdomain.com` → CloudFront) |
| **Amazon VPC** | Network isolation — services in private subnets, only ALB in public |
| **AWS WAF** | Web Application Firewall on ALB — blocks common attacks |
| **AWS CodePipeline** | CI/CD orchestration — source → build → push → deploy |
| **AWS CodeBuild** | Build Docker images and run tests |
| **Amazon CloudWatch** | Logs (structured JSON) + metrics + alarms |
| **AWS X-Ray** | Distributed tracing across microservices |
| **AWS Cloud Map** | Service discovery (services find each other by name, not hardcoded IP) |
| **Amazon ElastiCache Redis** | Rate limiting in API Gateway; session cache |
| **AWS IAM** | Fine-grained roles per ECS task (least privilege) |

---

## Architecture Diagram

```
Internet
    │
    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│  AWS WAF (DDoS + OWASP rules)                                             │
└───────────────────────────────────────────────────────────────────────────┘
    │
    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│  Amazon Route 53                                                           │
│  api.lms.com → ALB    cdn.lms.com → CloudFront                            │
└───────────────────────────────────────────────────────────────────────────┘
         │                                │
         ▼                                ▼
┌────────────────────┐       ┌────────────────────────┐
│  Application Load  │       │  Amazon CloudFront     │
│  Balancer (ALB)    │       │  + S3 Bucket           │
│  HTTPS :443        │       │  React SPA             │
└─────────┬──────────┘       └────────────────────────┘
          │
          │  (AWS VPC — Private Subnets)
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Amazon ECS Fargate Cluster                            │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │ api-gateway  │  │ auth-service │  │ user-service │  ...             │
│  │ Task (2)     │  │ Task (2)     │  │ Task (2)     │                  │
│  │ 0.5 vCPU    │  │ 0.5 vCPU    │  │ 0.5 vCPU    │                  │
│  │ 1 GB RAM    │  │ 1 GB RAM    │  │ 1 GB RAM    │                  │
│  └──────────────┘  └──────────────┘  └──────────────┘                  │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │course-service│  │exam-service  │  │finance-svc   │  ...             │
│  │ Task (2)     │  │ Task (2)     │  │ Task (2)     │                  │
│  └──────────────┘  └──────────────┘  └──────────────┘                  │
│                                                                          │
│  Service Discovery via AWS Cloud Map                                     │
│  auth-service.lms.local:8081                                             │
│  user-service.lms.local:8082  ...                                        │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Amazon RDS PostgreSQL 16 (Multi-AZ)                   │
│                                                                          │
│  lms_auth_db  lms_user_db  lms_course_db  lms_exam_db                  │
│  lms_attendance_db  lms_finance_db  lms_hr_db  lms_notification_db      │
│  lms_academics_db  lms_feedback_db  lms_research_db  lms_services_db    │
│                                                                          │
│  Read Replicas: course-service, examination-service (read-heavy)         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  Amazon SQS Queues (standard queues)                                     │
│  lms-user-registered  lms-course-enrolled  lms-assignment-graded         │
│  lms-payment-done  lms-leave-approved  lms-exam-scheduled                │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  Supporting Services                                                     │
│  S3: lms-files-bucket (assignments, materials)                          │
│  SES: transactional email                                                │
│  Secrets Manager: /lms/prod/auth, /lms/prod/db-password, etc.           │
│  ElastiCache Redis: rate limiting in api-gateway                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1 — Foundation (VPC, RDS, ECR)

### 1.1 VPC Setup

Create a production VPC with:
- **2 public subnets** (us-east-1a, us-east-1b) — ALB only
- **2 private subnets** (us-east-1a, us-east-1b) — ECS tasks
- **2 database subnets** (us-east-1a, us-east-1b) — RDS only
- NAT Gateway for private subnet outbound traffic

```bash
# Using AWS CLI or CloudFormation (see infra/aws/cloudformation/vpc.yml)
aws cloudformation deploy \
  --template-file infra/aws/cloudformation/vpc.yml \
  --stack-name lms-vpc \
  --capabilities CAPABILITY_IAM
```

### 1.2 RDS PostgreSQL

Single RDS instance with 12 databases (cost-effective vs 12 separate instances):

```bash
# Create RDS instance (db.t3.medium for staging, db.r6g.large for prod)
aws rds create-db-instance \
  --db-instance-identifier lms-postgres \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 16.4 \
  --master-username lmsadmin \
  --master-user-password <from-secrets-manager> \
  --allocated-storage 100 \
  --storage-type gp3 \
  --multi-az \
  --vpc-security-group-ids sg-xxxx \
  --db-subnet-group-name lms-db-subnet-group \
  --backup-retention-period 7 \
  --storage-encrypted
```

After RDS is up, create 12 databases:

```sql
-- Run via psql or RDS Query Editor
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

-- Create a separate user per service (least privilege)
CREATE USER auth_svc WITH PASSWORD 'xxx';
GRANT ALL PRIVILEGES ON DATABASE lms_auth_db TO auth_svc;

CREATE USER user_svc WITH PASSWORD 'xxx';
GRANT ALL PRIVILEGES ON DATABASE lms_user_db TO user_svc;
-- ... repeat for each service
```

### 1.3 ECR Repositories

Create one ECR repo per service:

```bash
for service in api-gateway auth-service user-service course-service \
  examination-service attendance-service finance-service hr-service \
  notification-service academics-service feedback-service research-service \
  student-services frontend; do
  aws ecr create-repository --repository-name lms/$service --region us-east-1
done
```

### 1.4 Secrets Manager

Store all secrets before deploying services:

```bash
# JWT signing secret
aws secretsmanager create-secret \
  --name /lms/prod/jwt-secret \
  --secret-string '{"JWT_SECRET":"your-256-bit-secret"}'

# DB credentials per service
aws secretsmanager create-secret \
  --name /lms/prod/auth-service-db \
  --secret-string '{"DB_URL":"jdbc:postgresql://lms-postgres.xxxxx.us-east-1.rds.amazonaws.com:5432/lms_auth_db","DB_USERNAME":"auth_svc","DB_PASSWORD":"xxx"}'

# SES credentials
aws secretsmanager create-secret \
  --name /lms/prod/ses \
  --secret-string '{"SES_ACCESS_KEY":"xxx","SES_SECRET_KEY":"xxx","SES_FROM":"no-reply@lms.yourdomain.com"}'

# Repeat for each service's DB credentials
```

---

## Phase 2 — Container Platform (ECS Fargate)

### 2.1 ECS Cluster

```bash
aws ecs create-cluster \
  --cluster-name lms-production \
  --capacity-providers FARGATE FARGATE_SPOT \
  --default-capacity-provider-strategy \
    capacityProvider=FARGATE,weight=1,base=1 \
    capacityProvider=FARGATE_SPOT,weight=3
```

Use **FARGATE_SPOT** for stateless services (70% cheaper) with FARGATE as baseline. **Never use SPOT for databases.**

### 2.2 Task Definition per Service

Each service gets an ECS Task Definition. Example for `auth-service`:

```json
{
  "family": "lms-auth-service",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::ACCOUNT:role/lms-auth-task-role",
  "containerDefinitions": [
    {
      "name": "auth-service",
      "image": "ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/lms/auth-service:latest",
      "portMappings": [{"containerPort": 8081, "protocol": "tcp"}],
      "environment": [
        {"name": "SPRING_PROFILES_ACTIVE", "value": "prod"},
        {"name": "SERVER_PORT", "value": "8081"}
      ],
      "secrets": [
        {"name": "DB_URL",      "valueFrom": "/lms/prod/auth-service-db:DB_URL::"},
        {"name": "DB_USERNAME", "valueFrom": "/lms/prod/auth-service-db:DB_USERNAME::"},
        {"name": "DB_PASSWORD", "valueFrom": "/lms/prod/auth-service-db:DB_PASSWORD::"},
        {"name": "JWT_SECRET",  "valueFrom": "/lms/prod/jwt-secret:JWT_SECRET::"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/lms/auth-service",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "auth"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:8081/actuator/health || exit 1"],
        "interval": 30, "timeout": 5, "retries": 3, "startPeriod": 60
      }
    }
  ]
}
```

Task definitions for all 12 services follow the same pattern (see `infra/aws/ecs/task-definitions/`).

### 2.3 ECS Services

Create an ECS Service per microservice (2 tasks each for HA):

```bash
aws ecs create-service \
  --cluster lms-production \
  --service-name auth-service \
  --task-definition lms-auth-service:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-private-1a,subnet-private-1b],securityGroups=[sg-auth-service],assignPublicIp=DISABLED}" \
  --load-balancers "targetGroupArn=arn:...,containerName=auth-service,containerPort=8081" \
  --service-registries "registryArn=arn:aws:servicediscovery:...auth-service" \
  --enable-execute-command
```

### 2.4 Auto Scaling

Each service scales independently based on CPU and memory:

```bash
# Register scalable target
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/lms-production/auth-service \
  --min-capacity 2 \
  --max-capacity 10

# CPU-based scaling policy
aws application-autoscaling put-scaling-policy \
  --policy-name cpu-scaling-auth-service \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/lms-production/auth-service \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration \
    '{
      "TargetValue": 70.0,
      "PredefinedMetricSpecification": {
        "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
      },
      "ScaleInCooldown": 300,
      "ScaleOutCooldown": 60
    }'
```

**Scale-out triggers per service:**

| Service | Scale trigger | Notes |
|---|---|---|
| auth-service | 70% CPU | Spikes at login events |
| course-service | 70% CPU + 80% Memory | Read-heavy during lectures |
| examination-service | 70% CPU | Peaks during exam season |
| attendance-service | 80% CPU | Bulk mark operations |
| notification-service | Queue depth > 100 | SQS-based scaling |

---

## Phase 3 — API Gateway & Load Balancer

### 3.1 Application Load Balancer

```bash
# Create ALB in public subnets
aws elbv2 create-load-balancer \
  --name lms-alb \
  --subnets subnet-public-1a subnet-public-1b \
  --security-groups sg-alb \
  --scheme internet-facing \
  --type application \
  --ip-address-type ipv4

# HTTPS Listener (port 443) with ACM certificate
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:... \
  --ssl-policy ELBSecurityPolicy-TLS13-1-2-2021-06 \
  --default-actions Type=forward,TargetGroupArn=arn:...:tg-api-gateway
```

All `/api/*` traffic flows: ALB → api-gateway ECS service → downstream services

The ALB only has one target group pointing to the `api-gateway` service. The gateway handles all routing to downstream services via AWS Cloud Map DNS.

### 3.2 AWS WAF on ALB

```bash
# Attach managed WAF rules (covers OWASP Top 10)
aws wafv2 create-web-acl \
  --name lms-waf \
  --scope REGIONAL \
  --default-action Allow={} \
  --rules '[
    {"Name":"AWSManagedRulesCommonRuleSet","Priority":1,...},
    {"Name":"AWSManagedRulesKnownBadInputsRuleSet","Priority":2,...},
    {"Name":"AWSManagedRulesSQLiRuleSet","Priority":3,...}
  ]'
```

### 3.3 ACM TLS Certificate

```bash
# Request cert for your domain
aws acm request-certificate \
  --domain-name "lms.yourdomain.com" \
  --subject-alternative-names "*.lms.yourdomain.com" "api.lms.yourdomain.com" \
  --validation-method DNS
```

---

## Phase 4 — Messaging & Storage

### 4.1 SQS Queues

```bash
# Create all event queues (standard queues for most; FIFO for payment)
for queue in lms-user-registered lms-course-enrolled lms-assignment-graded \
  lms-exam-scheduled lms-leave-approved lms-payroll-generated; do
  aws sqs create-queue --queue-name $queue \
    --attributes '{"MessageRetentionPeriod":"86400","VisibilityTimeout":"30"}'
done

# Payment queue as FIFO (exactly-once delivery)
aws sqs create-queue --queue-name lms-payment-done.fifo \
  --attributes '{"FifoQueue":"true","ContentBasedDeduplication":"true"}'

# Dead-letter queues for failed message processing
for queue in lms-user-registered lms-course-enrolled lms-assignment-graded; do
  aws sqs create-queue --queue-name ${queue}-dlq \
    --attributes '{"MessageRetentionPeriod":"1209600"}'
done
```

### 4.2 S3 Buckets

```bash
# Files bucket (assignment submissions, course materials, profile photos)
aws s3 mb s3://lms-files-prod --region us-east-1

# Bucket policy — block public access, require signed URLs
aws s3api put-public-access-block \
  --bucket lms-files-prod \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# CORS for file uploads from browser
aws s3api put-bucket-cors --bucket lms-files-prod --cors-configuration '{
  "CORSRules": [{
    "AllowedOrigins": ["https://lms.yourdomain.com"],
    "AllowedMethods": ["GET","PUT","POST"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }]
}'

# Lifecycle policy — move old files to S3 Glacier after 90 days
aws s3api put-bucket-lifecycle-configuration \
  --bucket lms-files-prod \
  --lifecycle-configuration file://infra/aws/s3-lifecycle.json
```

### 4.3 Amazon SES

```bash
# Verify your sending domain
aws ses verify-domain-identity --domain lms.yourdomain.com

# Request production access (removes sandbox limitations)
# Done via AWS Console → SES → Account dashboard → Request production access

# Create email template for common notifications
aws ses create-template --cli-input-json file://infra/aws/ses-templates/welcome.json
```

### 4.4 ElastiCache Redis (Rate Limiting)

```bash
# Redis for API Gateway rate limiting
aws elasticache create-replication-group \
  --replication-group-id lms-redis \
  --description "LMS API Gateway rate limiting" \
  --cache-node-type cache.t3.small \
  --engine redis \
  --engine-version 7.1 \
  --num-cache-clusters 2 \
  --cache-subnet-group-name lms-redis-subnet \
  --security-group-ids sg-redis \
  --at-rest-encryption-enabled \
  --transit-encryption-enabled
```

---

## Phase 5 — Frontend (CloudFront + S3)

### 5.1 S3 Bucket for React Build

```bash
# Create bucket for frontend assets
aws s3 mb s3://lms-frontend-prod --region us-east-1

# Block all public access — CloudFront will serve it
aws s3api put-public-access-block \
  --bucket lms-frontend-prod \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

### 5.2 CloudFront Distribution

```bash
# Create CloudFront distribution
aws cloudfront create-distribution --distribution-config '{
  "Origins": {
    "Items": [{
      "Id": "lms-frontend-s3",
      "DomainName": "lms-frontend-prod.s3.amazonaws.com",
      "S3OriginConfig": {"OriginAccessIdentity": "origin-access-identity/cloudfront/xxx"}
    }]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "lms-frontend-s3",
    "ViewerProtocolPolicy": "redirect-to-https",
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6"
  },
  "CustomErrorResponses": {
    "Items": [{"ErrorCode": 404, "ResponsePagePath": "/index.html", "ResponseCode": "200"}]
  },
  "Aliases": {"Items": ["lms.yourdomain.com"]},
  "ViewerCertificate": {"AcmCertificateArn": "arn:aws:acm:us-east-1:...", "SslSupportMethod": "sni-only"}
}'
```

The `CustomErrorResponse` redirecting 404 → `/index.html` is required for React Router to work (client-side routing).

### 5.3 Frontend Build & Deploy

```bash
# In CI/CD or manually:
cd frontend
npm run build
aws s3 sync dist/ s3://lms-frontend-prod/ --delete
aws cloudfront create-invalidation --distribution-id EXXX --paths "/*"
```

---

## Phase 6 — CI/CD Pipeline

### 6.1 Pipeline Architecture

```
GitHub Push → AWS CodePipeline
  │
  ├── Source: CodeStar Connection (GitHub)
  │
  ├── Build: AWS CodeBuild
  │   ├── ./gradlew test
  │   ├── docker build -t auth-service .
  │   └── docker push ECR
  │
  └── Deploy: ECS Deploy Action
      └── aws ecs update-service --force-new-deployment
```

### 6.2 CodeBuild buildspec.yml (per service)

```yaml
# auth-service/buildspec.yml
version: 0.2
phases:
  pre_build:
    commands:
      - aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_REGISTRY
  build:
    commands:
      - cd auth-service
      - ./gradlew test
      - docker build -t lms/auth-service:$CODEBUILD_RESOLVED_SOURCE_VERSION .
      - docker tag lms/auth-service:$CODEBUILD_RESOLVED_SOURCE_VERSION $ECR_REGISTRY/lms/auth-service:latest
  post_build:
    commands:
      - docker push $ECR_REGISTRY/lms/auth-service:latest
      - printf '[{"name":"auth-service","imageUri":"%s"}]' $ECR_REGISTRY/lms/auth-service:latest > imagedefinitions.json
artifacts:
  files: auth-service/imagedefinitions.json
```

### 6.3 Deploy Script

```bash
#!/bin/bash
# infra/aws/scripts/deploy.sh
SERVICE=$1
CLUSTER=lms-production

echo "Deploying $SERVICE to ECS cluster $CLUSTER..."
aws ecs update-service \
  --cluster $CLUSTER \
  --service $SERVICE \
  --force-new-deployment \
  --region us-east-1

# Wait for deployment to stabilize
aws ecs wait services-stable \
  --cluster $CLUSTER \
  --services $SERVICE

echo "Deploy complete for $SERVICE"
```

---

## Phase 7 — Observability

### 7.1 CloudWatch Log Groups

```bash
# Create log group per service
for service in api-gateway auth-service user-service course-service \
  examination-service attendance-service finance-service hr-service \
  notification-service academics-service feedback-service research-service \
  student-services; do
  aws logs create-log-group --log-group-name /ecs/lms/$service
  aws logs put-retention-policy --log-group-name /ecs/lms/$service --retention-in-days 30
done
```

### 7.2 CloudWatch Alarms

```bash
# Example: High error rate on auth-service
aws cloudwatch put-metric-alarm \
  --alarm-name lms-auth-service-5xx \
  --metric-name HTTPCode_Target_5XX_Count \
  --namespace AWS/ApplicationELB \
  --dimensions Name=TargetGroup,Value=tg-auth-service \
  --period 60 \
  --statistic Sum \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:xxx:lms-alerts \
  --treat-missing-data notBreaching
```

### 7.3 X-Ray Distributed Tracing

Add to each service's `build.gradle`:

```groovy
implementation 'io.awspring.cloud:spring-cloud-aws-starter-xray'
```

Add to `application.yml`:

```yaml
management:
  tracing:
    sampling:
      probability: 0.1  # 10% sampling in prod
cloud:
  aws:
    xray:
      enabled: true
```

The `MdcCorrelationFilter` (carried over from v1) adds `traceId` to every log line. X-Ray ties the distributed traces together across all 12 services.

### 7.4 CloudWatch Dashboard

Create a dashboard in CloudWatch with:
- ECS task counts per service
- CPU and memory utilization per service
- RDS connections and query latency
- ALB request count, latency, 5xx rate
- SQS queue depth per queue
- S3 bucket usage

---

## Security Checklist

### Network Security

- [ ] All ECS tasks in **private subnets** — no public IP
- [ ] RDS in **database subnets** — no internet access
- [ ] Security groups: ECS tasks only allow port from ALB SG, RDS only from ECS SG
- [ ] NAT Gateway for outbound only (SES, S3, ECR pulls)

### Data Security

- [ ] RDS encryption at rest (AES-256)
- [ ] S3 server-side encryption (SSE-S3 or SSE-KMS)
- [ ] ElastiCache in-transit encryption enabled
- [ ] Secrets Manager rotation enabled for DB passwords (90-day rotation)

### Application Security

- [ ] JWT stored in **httpOnly cookie** (not localStorage — fixes v1 XSS issue)
- [ ] CSRF protection in Spring Security
- [ ] Input validation with `@Valid` on all request bodies
- [ ] Rate limiting on `/api/auth/login` (10 req/min via Redis + Spring Cloud Gateway)
- [ ] WAF rules active (SQL injection, XSS, bad bots)

### IAM Security

- [ ] Each ECS task has its own IAM role (least privilege)
- [ ] Task roles only allow the specific S3 bucket, SQS queues, Secrets Manager paths needed
- [ ] No wildcard `*` permissions in task roles

### Compliance

- [ ] CloudTrail enabled (API call audit logs)
- [ ] Config rules for RDS encryption, public S3 buckets
- [ ] VPC Flow Logs enabled

---

## Cost Estimate

### Staging Environment (us-east-1, 2025 pricing)

| Service | Config | Monthly Est. |
|---|---|---|
| ECS Fargate (13 services × 0.5 vCPU × 1 task) | 6.5 vCPU on SPOT mix | ~$35 |
| RDS PostgreSQL db.t3.medium Multi-AZ | 100 GB gp3 | ~$80 |
| ALB | Low traffic | ~$20 |
| CloudFront + S3 | 10 GB/month | ~$5 |
| SQS | < 1M requests/month | ~$1 |
| ElastiCache cache.t3.small | Single node | ~$25 |
| SES | < 10K emails/month | ~$1 |
| Secrets Manager | 13 secrets | ~$5 |
| CloudWatch Logs | 5 GB/month | ~$5 |
| NAT Gateway | Low traffic | ~$35 |
| **Total Staging** | | **~$212/month** |

### Production Environment (2 tasks per service)

| Service | Config | Monthly Est. |
|---|---|---|
| ECS Fargate (13 services × 0.5 vCPU × 2 tasks) | FARGATE + SPOT mix | ~$70 |
| RDS PostgreSQL db.r6g.large Multi-AZ | 500 GB gp3 | ~$280 |
| ALB | Medium traffic | ~$25 |
| CloudFront + S3 | 50 GB/month | ~$15 |
| SQS | 5M requests/month | ~$2 |
| ElastiCache cache.t3.small (2 nodes) | Cluster mode | ~$50 |
| SES | 50K emails/month | ~$5 |
| Secrets Manager | 13 secrets | ~$5 |
| CloudWatch Logs + X-Ray | 20 GB/month | ~$15 |
| NAT Gateway | Medium traffic | ~$45 |
| WAF | Managed rules | ~$25 |
| **Total Production** | | **~$537/month** |

> Scale the ECS tasks up during exam season (examination-service × 4), down afterward.

---

## Environment Strategy

| Environment | Purpose | Scale |
|---|---|---|
| `local` | Developer laptop (Docker Compose) | 1 task per service |
| `staging` | QA / pre-prod (ECS Fargate, us-east-1) | 1 task per service, SPOT |
| `production` | Live (ECS Fargate, us-east-1, Multi-AZ) | 2 tasks per service |

Each ECS Task Definition has environment-specific configs via Spring profiles:

```yaml
# application-prod.yml (loaded when SPRING_PROFILES_ACTIVE=prod)
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
logging:
  level:
    com.lms: INFO
management:
  tracing:
    sampling:
      probability: 0.1
```

---

## Rollback Strategy

### ECS Blue/Green Deploy (recommended for critical services)

```bash
# CodeDeploy handles blue/green for ECS
aws deploy create-deployment \
  --application-name lms-auth-service \
  --deployment-group-name lms-auth-service-dg \
  --revision '{"revisionType":"AppSpecContent","appSpecContent":{"content":"..."}}'
```

New tasks are started alongside old tasks. Traffic shifts 10% → 50% → 100% over 5 minutes. Automatic rollback if health checks fail.

### Quick Rollback (manual)

```bash
# Roll back to previous task definition revision
aws ecs update-service \
  --cluster lms-production \
  --service auth-service \
  --task-definition lms-auth-service:PREVIOUS_REVISION
```

Database rollbacks via Flyway:

```bash
# Flyway undo (requires Flyway Pro) or run manual undo SQL
./gradlew flywayUndo -Pflyway.url=$DB_URL
```

---

## Quick-Start Deployment Checklist

```
[ ] 1. Create AWS account + set billing alerts
[ ] 2. Deploy VPC (infra/aws/cloudformation/vpc.yml)
[ ] 3. Create RDS instance + 12 databases
[ ] 4. Create 13 ECR repositories
[ ] 5. Store secrets in Secrets Manager
[ ] 6. Create ECS cluster (lms-production)
[ ] 7. Build + push Docker images to ECR
[ ] 8. Register ECS task definitions (infra/aws/ecs/task-definitions/)
[ ] 9. Create ECS services (2 tasks each)
[ ] 10. Create ALB + target groups + listener
[ ] 11. Configure Route 53 DNS
[ ] 12. Create CloudFront distribution
[ ] 13. Build frontend + sync to S3
[ ] 14. Create SQS queues
[ ] 15. Verify SES domain
[ ] 16. Set up CodePipeline CI/CD
[ ] 17. Enable CloudWatch alarms + X-Ray tracing
[ ] 18. Run smoke tests against production URL
```
