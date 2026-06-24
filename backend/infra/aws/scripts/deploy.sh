#!/bin/bash
# deploy.sh — Build, push to ECR, and update ECS service
# Usage: ./deploy.sh <service-name> [<image-tag>]
# Example: ./deploy.sh auth-service v2.0.1

set -e

SERVICE=$1
TAG=${2:-latest}
REGION=us-east-1
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REGISTRY="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"
CLUSTER=lms-production

if [ -z "$SERVICE" ]; then
  echo "Usage: $0 <service-name> [tag]"
  exit 1
fi

echo "==> Logging into ECR..."
aws ecr get-login-password --region $REGION | \
  docker login --username AWS --password-stdin $ECR_REGISTRY

echo "==> Building $SERVICE..."
docker build -t lms/$SERVICE:$TAG ./$SERVICE

echo "==> Tagging and pushing to ECR..."
docker tag lms/$SERVICE:$TAG $ECR_REGISTRY/lms/$SERVICE:$TAG
docker push $ECR_REGISTRY/lms/$SERVICE:$TAG

# Update task definition with new image
echo "==> Registering new task definition for $SERVICE..."
TASK_DEF_FILE="infra/aws/ecs/task-definitions/$SERVICE.json"
sed "s|ACCOUNT_ID|$ACCOUNT_ID|g; s|:latest|:$TAG|g" \
  $TASK_DEF_FILE > /tmp/task-def-$SERVICE.json

NEW_REVISION=$(aws ecs register-task-definition \
  --cli-input-json file:///tmp/task-def-$SERVICE.json \
  --query 'taskDefinition.taskDefinitionArn' \
  --output text)

echo "==> Deploying revision: $NEW_REVISION"
aws ecs update-service \
  --cluster $CLUSTER \
  --service $SERVICE \
  --task-definition $NEW_REVISION \
  --region $REGION

echo "==> Waiting for $SERVICE deployment to stabilize..."
aws ecs wait services-stable \
  --cluster $CLUSTER \
  --services $SERVICE \
  --region $REGION

echo "==> Deploy complete for $SERVICE ($TAG)"
