#!/bin/bash

# Simple Docker test runner for DemoBlaze Selenium tests

set -e

IMAGE_NAME="demoblaze-tests"
TEST_COMMAND=${1:-"mvn clean test -Dselenide.headless=true"}

echo "🐳 Building Docker image..."
docker build -t ${IMAGE_NAME} .

echo "🧪 Running tests in Docker..."

# Create output directories
mkdir -p target/allure-results target/logs target/screenshots target/surefire-reports

# Run tests with volume mounts
docker run --rm \
    -v "$(pwd)/target:/app/target" \
    ${IMAGE_NAME} \
    ${TEST_COMMAND}

echo "✅ Test execution completed!"
echo "📋 Results are in target/ directory"