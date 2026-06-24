#!/bin/bash
# deploy-all.sh — Deploy all services in dependency order
# Usage: ./deploy-all.sh [tag]

TAG=${1:-latest}

SERVICES=(
  api-gateway
  auth-service
  user-service
  course-service
  examination-service
  attendance-service
  finance-service
  hr-service
  notification-service
  academics-service
  feedback-service
  research-service
  student-services
)

for service in "${SERVICES[@]}"; do
  echo "=============================="
  echo "Deploying: $service"
  echo "=============================="
  ./infra/aws/scripts/deploy.sh "$service" "$TAG"
  echo ""
done

echo "All services deployed successfully!"
