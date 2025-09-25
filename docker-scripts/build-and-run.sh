#!/bin/bash

# Docker test runner for DemoBlaze tests (JUnit + BDD Cucumber)

set -e

IMAGE_NAME="demoblaze-tests"
TEST_TYPE=${1:-"all"}  # all, junit-only, bdd-only
BROWSER=${2:-"chrome"}  # chrome, firefox
HEADLESS=${3:-"true"}   # true, false

echo "🐳 Building Docker image..."
docker build -t ${IMAGE_NAME} .

echo "🧪 Running ${TEST_TYPE} tests in Docker with ${BROWSER}..."

# Create output directories
mkdir -p target/allure-results target/logs target/screenshots target/surefire-reports target/cucumber-reports

# Build test command based on parameters
if [ "$TEST_TYPE" = "all" ]; then
    TEST_COMMAND="mvn clean test && mvn test -Dtest=runners.CucumberTestRunner"
elif [ "$TEST_TYPE" = "junit-only" ]; then
    TEST_COMMAND="mvn clean test"
elif [ "$TEST_TYPE" = "bdd-only" ]; then
    TEST_COMMAND="mvn clean test -Dtest=runners.CucumberTestRunner"
else
    echo "❌ Invalid test type. Use: all, junit-only, or bdd-only"
    exit 1
fi

# Add browser and headless configuration
TEST_COMMAND="${TEST_COMMAND} -Dselenide.browser=${BROWSER}"
if [ "$HEADLESS" = "true" ]; then
    TEST_COMMAND="${TEST_COMMAND} -Dselenide.headless=true"
fi

# Run tests with volume mounts
docker run --rm \
    -v "$(pwd)/target:/app/target" \
    --shm-size=2g \
    -e DISPLAY=:99 \
    ${IMAGE_NAME} \
    sh -c "Xvfb :99 -screen 0 1920x1080x24 & ${TEST_COMMAND}"

echo "✅ Test execution completed!"
echo "📋 Results are available in:"
echo "   - JUnit Reports: target/surefire-reports/"
echo "   - BDD Reports: target/cucumber-reports/"
echo "   - Allure Results: target/allure-results/"
echo "   - Screenshots: target/screenshots/"
echo "   - Logs: target/logs/"

# Generate Allure report if results exist
if [ -d "target/allure-results" ] && [ "$(ls -A target/allure-results)" ]; then
    echo "📊 Generating Allure report..."
    if command -v allure &> /dev/null; then
        allure generate target/allure-results -o target/allure-report --clean
        echo "📊 Allure report generated: target/allure-report/index.html"
    else
        echo "⚠️  Allure not installed locally. Install Allure to generate reports."
    fi
fi