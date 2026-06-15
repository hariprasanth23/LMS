#!/bin/bash
# Creates SQS queues and S3 bucket in LocalStack for local development

echo "Creating SQS queues..."
awslocal sqs create-queue --queue-name lms-user-registered
awslocal sqs create-queue --queue-name lms-course-enrolled
awslocal sqs create-queue --queue-name lms-assignment-graded
awslocal sqs create-queue --queue-name lms-leave-approved
awslocal sqs create-queue --queue-name lms-exam-scheduled
awslocal sqs create-queue --queue-name lms-payment-done.fifo \
  --attributes FifoQueue=true,ContentBasedDeduplication=true

echo "Creating S3 bucket..."
awslocal s3 mb s3://lms-files-local

echo "LocalStack setup complete."
