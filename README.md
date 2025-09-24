# DemoBlaze Test Automation Framework

A comprehensive test automation framework for DemoBlaze e-commerce website using Selenide, JUnit 5, and Allure reporting.

## Framework Features

- **Selenide 7.10.0** - Simplified WebDriver automation
- **JUnit 5** - Modern testing framework
- **Allure Reporting** - Rich test reports with screenshots
- **Page Object Model** - Clean separation of page logic
- **Centralized Test Data** - Organized test data management
- **Comprehensive Logging** - SLF4J with Logback
- **Screenshot on Failure** - Automatic screenshot capture

## Project Structure

```
src/
├── main/java/
│   ├── data/
│   │   └── TestData.java          # Centralized test data and selectors
│   └── pages/                     # Page Object Model classes
│       ├── HomePage.java
│       ├── ProductDetailsPage.java
│       ├── CartPage.java
│       ├── ContactModal.java
│       └── OrderPlacementPage.java
└── test/java/
    ├── base/
    │   └── BaseTest.java          # Base test configuration
    ├── tests/                     # Test classes
    │   ├── HomePageTest.java
    │   ├── CartPageTest.java
    │   ├── ContactModalTest.java
    │   └── OrderPlacementTest.java
    └── utils/
        └── TestListener.java      # Test listener for screenshots
```

## Getting Started

### Prerequisites
- Java 21
- Maven 3.6+
- Chrome browser

### Running Tests
```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=HomePageTest

# Run specific test method
mvn test -Dtest=ContactModalTest#testContactModalClose
```

### Generate Allure Reports
```bash
# Generate Allure report
mvn allure:serve
```

## Test Data Management

All test data is centralized in `TestData.java` with organized sections:
- **Products** - Product names and details
- **ContactFormData** - Contact form test data
- **OrderFormData** - Order placement data
- **Selectors** - CSS selectors and XPath expressions
- **Timeouts** - Wait times and delays

## Logging

- **Test Execution Logs**: `target/logs/test-execution.log`
- **Page Action Logs**: `target/logs/page-actions.log`
- **Console Output**: Real-time test progress

## Features Tested

- ✅ Home page navigation and elements
- ✅ Product catalog and details
- ✅ Shopping cart functionality
- ✅ Contact form modal
- ✅ Order placement workflow
- ✅ Form validation scenarios

## CI/CD Integration

### 🐳 Docker Support
The framework supports containerized execution with Docker:

```bash
# Build and run tests in Docker (Linux/Mac)
./docker-scripts/build-and-run.sh

# Build and run tests in Docker (Windows)
docker-scripts\build-and-run.bat

# Manual Docker build
docker build -t demoblaze-tests .
docker run --rm -v $(pwd)/target:/app/target demoblaze-tests
```

### 🔄 Jenkins Pipeline
Complete CI/CD pipeline with Jenkins integration:

**Features:**
- ✅ **Parameterized builds** (test suite, browser, headless mode)
- ✅ **Docker containerized execution**
- ✅ **Allure reporting** with screenshots
- ✅ **Slack notifications** for build status
- ✅ **Email notifications** with detailed reports
- ✅ **JIRA integration** for failed test tickets
- ✅ **Artifact archival** (logs, screenshots, reports)

**Setup:**
1. Install required Jenkins plugins (see `jenkins/plugins.txt`)
2. Configure global tools (Maven, JDK, Allure)
3. Set up credentials (Slack, JIRA, Email)
4. Create pipeline job with `Jenkinsfile`

See `jenkins/jenkins-setup.md` for detailed configuration guide.

### 📊 Reporting
- **JUnit XML reports** for Jenkins test results
- **Allure HTML reports** with interactive dashboards
- **Screenshots** automatically captured on test failures
- **Logs** with separate files for page actions and test execution

### 🔔 Notifications
- **Slack integration** with build status messages
- **Email notifications** with HTML formatting
- **JIRA tickets** created automatically for test failures

## Browser Support

Supports multiple browsers with full-screen execution and screenshot capabilities:
- **Chrome** (default) - Stable and fast execution
- **Firefox** - Cross-browser compatibility testing
- **Headless mode** - For CI/CD and faster execution

## Quick Start Commands

### Local Execution
```bash
# Run all tests (Chrome by default)
mvn test

# Run tests with Chrome
mvn test -Dselenide.browser=chrome

# Run tests with Firefox
mvn test -Dselenide.browser=firefox

# Run in headless mode
mvn test -Dselenide.headless=true

# Run Firefox in headless mode
mvn test -Dselenide.browser=firefox -Dselenide.headless=true

# Generate Allure report
mvn allure:serve
```

### Docker Execution
```bash
# Default (Chrome headless)
./docker-scripts/build-and-run.sh

# Firefox headless
BROWSER=firefox ./docker-scripts/build-and-run.sh

# Chrome with UI (non-headless) - requires X11 forwarding
HEADLESS=false ./docker-scripts/build-and-run.sh

# Windows - Firefox
set BROWSER=firefox && docker-scripts\build-and-run.bat
```

### Browser Configuration
The framework automatically configures browser-specific settings:
- **Chrome**: Optimized for speed and stability
- **Firefox**: Enhanced for cross-browser compatibility
- **Headless**: Faster execution for CI/CD pipelines