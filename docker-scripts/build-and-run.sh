#!/bin/bash

# Build and run DemoBlaze Selenium tests in Docker

set -e

# Configuration
IMAGE_NAME="demoblaze-selenium-tests"
CONTAINER_NAME="demoblaze-test-run"
BUILD_NUMBER=${BUILD_NUMBER:-"local-$(date +%Y%m%d-%H%M%S)"}

# Browser configuration (default to chrome, can be overridden)
BROWSER=${BROWSER:-"chrome"}
HEADLESS=${HEADLESS:-"true"}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐳 Building Docker image...${NC}"
docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} .
docker tag ${IMAGE_NAME}:${BUILD_NUMBER} ${IMAGE_NAME}:latest

echo -e "${BLUE}🧪 Running tests in Docker container...${NC}"

# Create directories for outputs
mkdir -p target/allure-results
mkdir -p target/logs
mkdir -p target/screenshots
mkdir -p target/surefire-reports

# Run tests with volume mounts for outputs
docker run --rm \
    --name ${CONTAINER_NAME} \
    -v "$(pwd)/target/allure-results:/app/target/allure-results" \
    -v "$(pwd)/target/logs:/app/target/logs" \
    -v "$(pwd)/target/screenshots:/app/target/screenshots" \
    -v "$(pwd)/target/surefire-reports:/app/target/surefire-reports" \
    -e SELENIDE_HEADLESS=${HEADLESS} \
    -e SELENIDE_BROWSER=${BROWSER} \
    -e SELENIDE_BROWSER_SIZE=1920x1080 \
    ${IMAGE_NAME}:${BUILD_NUMBER} \
    mvn clean test -Dselenide.browser=${BROWSER} -Dselenide.headless=${HEADLESS}

# Check test results
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Tests completed successfully!${NC}"
else
    echo -e "${RED}❌ Tests failed!${NC}"
    exit 1
fi

# Generate Allure report if allure is available
if command -v allure &> /dev/null; then
    echo -e "${BLUE}📊 Generating Allure report...${NC}"
    allure generate target/allure-results -o target/allure-report --clean
    echo -e "${GREEN}📋 Allure report generated in target/allure-report${NC}"
    echo -e "${YELLOW}💡 Run 'allure serve target/allure-results' to view the report${NC}"
else
    echo -e "${YELLOW}⚠️  Allure not found. Install Allure to generate HTML reports.${NC}"
fi

# Cleanup
echo -e "${BLUE}🧹 Cleaning up Docker image...${NC}"
docker rmi ${IMAGE_NAME}:${BUILD_NUMBER}

echo -e "${GREEN}🎉 Test execution completed!${NC}"