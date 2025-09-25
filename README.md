# DemoBlaze Test Automation Framework

A comprehensive dual-architecture test automation framework for DemoBlaze e-commerce website featuring both traditional JUnit testing and BDD Cucumber implementation with Selenide, comprehensive reporting, and Docker containerization.

## Framework Features

### Core Technologies
- **Selenide 7.10.0** - Simplified WebDriver automation with built-in waits
- **Java 21** - Latest LTS Java version with enhanced performance
- **Maven** - Build automation and dependency management

### Testing Frameworks
- **JUnit 5** - Traditional unit/integration testing approach
- **Cucumber 7.14.1** - BDD framework with Gherkin syntax for business-readable scenarios
- **Dual Architecture** - Support both traditional and BDD testing approaches

### Reporting & Analysis
- **Allure 2.30.0** - Rich interactive reports with screenshots, videos, and trends
- **Cucumber HTML Reports** - Native BDD reporting with scenario details
- **Page Object Model** - Clean separation of page logic and test scenarios
- **Screenshot on Failure** - Automatic screenshot capture with Allure integration

### DevOps & CI/CD
- **Docker Support** - Complete containerization with Chrome/Firefox browsers
- **Jenkins Pipeline** - Comprehensive CI/CD with auto-triggers and notifications
- **Multi-browser Testing** - Chrome and Firefox support with headless execution
- **Comprehensive Logging** - SLF4J with Logback, separate log files by component

## Project Structure

```
src/
├── main/java/
│   ├── data/
│   │   └── TestData.java                    # Centralized test data and selectors
│   └── pages/                               # Page Object Model classes
│       ├── HomePage.java
│       ├── ProductDetailsPage.java
│       ├── CartPage.java
│       ├── ContactModal.java
│       └── OrderPlacementPage.java
└── test/java/
    ├── base/
    │   └── BaseTest.java                    # Base test configuration with Docker support
    ├── tests/                               # Traditional JUnit test classes
    │   ├── HomePageTest.java
    │   ├── CartPageTest.java
    │   ├── ContactModalTest.java
    │   └── OrderPlacementTest.java
    ├── bdd/                                 # BDD implementation (new)
    │   ├── BddStyleTests.java               # BDD-style test utilities
    │   ├── BddTestRunner.java               # BDD test runner configuration
    │   └── BddTestUtils.java                # BDD helper utilities
    ├── stepDefinitions/                     # Cucumber step definitions (new)
    │   ├── HomePageSteps.java
    │   ├── CartSteps.java
    │   └── ContactSteps.java
    ├── runners/                             # Cucumber test runners (new)
    │   └── CucumberTestRunner.java
    ├── hooks/                               # BDD hooks and setup (new)
    │   └── TestHooks.java
    └── utils/
        └── TestListener.java                # Test listener for screenshots

src/test/resources/
└── features/                                # Gherkin feature files (new)
    ├── HomePage.feature
    ├── Cart.feature
    ├── Contact.feature
    └── OrderPlacement.feature
```

## Getting Started

### Prerequisites
- **Java 21** (LTS)
- **Maven 3.6+**
- **Chrome browser** (or Firefox)
- **Docker** (optional, for containerized execution)

### Running Traditional JUnit Tests
```bash
# Run all JUnit tests
mvn test

# Run specific test class
mvn test -Dtest=tests.HomePageTest

# Run specific test method
mvn test -Dtest=tests.ContactModalTest#testContactModalClose

# Run with different browsers
mvn test -Dselenide.browser=chrome
mvn test -Dselenide.browser=firefox

# Run in headless mode
mvn test -Dselenide.headless=true
```

### Running BDD Cucumber Tests
```bash
# Run all BDD tests
mvn test -Dtest=runners.CucumberTestRunner

# Run tests with specific tags
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@Smoke"
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@regression"
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@Cart"

# Run BDD tests with browser configuration
mvn test -Dtest=runners.CucumberTestRunner -Dselenide.browser=firefox
```

### Running Both Test Types
```bash
# Run all tests (JUnit + BDD) sequentially
mvn test && mvn test -Dtest=runners.CucumberTestRunner
```

### Generate Reports
```bash
# Generate and serve Allure report (works for both JUnit and BDD)
mvn allure:serve

# Generate Allure report only
mvn allure:report

# Generate Cucumber HTML reports (for BDD tests)
mvn verify

# View Cucumber reports
# Reports location: target/cucumber-reports/overview-features.html
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
The framework supports containerized execution with enhanced multi-test capabilities:

```bash
# Run all tests (JUnit + BDD) - Linux/Mac
./docker-scripts/build-and-run.sh

# Run all tests (JUnit + BDD) - Windows
docker-scripts\build-and-run.bat

# Run specific test types with browser selection
./docker-scripts/build-and-run.sh junit-only chrome true    # JUnit only, Chrome, headless
./docker-scripts/build-and-run.sh bdd-only firefox false    # BDD only, Firefox, with GUI
./docker-scripts/build-and-run.sh all chrome true           # Both test types, Chrome, headless

# Windows examples
docker-scripts\build-and-run.bat junit-only firefox true
docker-scripts\build-and-run.bat bdd-only chrome true

# Manual Docker execution
docker build -t demoblaze-tests .
docker run --rm -v "$(pwd)/target:/app/target" --shm-size=2g demoblaze-tests
```

### 🔄 Jenkins Pipeline
Enhanced CI/CD pipeline with comprehensive test type support:

**Features:**
- ✅ **Multi-test execution** - JUnit only, BDD only, or combined execution
- ✅ **Auto-trigger on push** - Pipeline automatically starts on repository changes
- ✅ **Parameterized builds** - Test type, suite, browser, and headless mode selection
- ✅ **Docker containerized execution** - Isolated test environment with Xvfb display
- ✅ **Dual reporting** - Both Allure and Cucumber HTML reports
- ✅ **Comprehensive notifications** - Slack, email with build status and test type info
- ✅ **Enhanced artifact management** - Screenshots, logs, multiple report formats
- ✅ **Tag-based filtering** - Support for @Smoke, @regression, @Cart, etc.

**Pipeline Parameters:**
- `TEST_TYPE`: all, junit-only, bdd-only
- `TEST_SUITE`: all, smoke, regression, cart, homepage, contact, orderplacement
- `BROWSER`: chrome, firefox
- `HEADLESS`: true, false

**Auto-Trigger Setup:**
The pipeline includes `githubPush()` trigger for automatic execution on repository changes.

**Setup Requirements:**
- Jenkins agent with `linux-agent` label
- Docker capability on Jenkins agent
- Configured webhooks for GitHub integration

### 📊 Reporting
Multiple reporting formats for comprehensive test analysis:
- **Allure Reports** - Interactive dashboards with trends, history, and detailed test results
- **Cucumber HTML Reports** - Business-readable BDD scenarios with step-by-step execution
- **JUnit XML Reports** - Standard format for CI/CD integration
- **Screenshots** - Automatic capture on test failures with Allure integration
- **Comprehensive Logs** - Separate files for test execution and page actions with rolling policy

### 🔔 Notifications
Enhanced notification system with test type information:
- **Auto-trigger notifications** - Pipeline starts automatically on repository changes
- **Slack integration** - Real-time build status with test type and suite details
- **Email notifications** - HTML-formatted reports with comprehensive build information
- **Status updates** - Success, failure, and unstable build notifications

## Browser Support

Enhanced multi-browser testing with Docker containerization:
- **Chrome** (default) - Optimized for stability with Docker-specific configurations
- **Firefox** - Cross-browser compatibility with ESR version in containers
- **Headless mode** - CI/CD optimized execution with Xvfb display server
- **Docker optimization** - Automatic browser arguments for containerized execution
- **Session management** - Unique user-data directories to prevent conflicts

## Quick Start Commands

### Local Execution
```bash
# Traditional JUnit Tests
mvn test                                                    # All JUnit tests (Chrome)
mvn test -Dtest=tests.HomePageTest                         # Specific JUnit test class
mvn test -Dselenide.browser=firefox                       # JUnit tests with Firefox

# BDD Cucumber Tests
mvn test -Dtest=runners.CucumberTestRunner                 # All BDD tests
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@Smoke"  # Smoke tests
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@regression"  # Regression tests

# Combined Execution
mvn test && mvn test -Dtest=runners.CucumberTestRunner     # Both JUnit and BDD

# Browser and Mode Configuration
mvn test -Dselenide.browser=firefox -Dselenide.headless=true  # Firefox headless
mvn test -Dtest=runners.CucumberTestRunner -Dselenide.browser=chrome  # BDD with Chrome

# Generate Reports
mvn allure:serve                                           # Interactive Allure report
mvn verify                                                 # Generate Cucumber HTML reports
```

### Docker Execution with Test Type Selection
```bash
# All tests (JUnit + BDD) - Default
./docker-scripts/build-and-run.sh                         # Linux/Mac
docker-scripts\build-and-run.bat                          # Windows

# Test type specific execution
./docker-scripts/build-and-run.sh junit-only chrome true  # JUnit only, Chrome, headless
./docker-scripts/build-and-run.sh bdd-only firefox true   # BDD only, Firefox, headless
./docker-scripts/build-and-run.sh all firefox false       # Both types, Firefox, with GUI

# Windows examples with test type selection
docker-scripts\build-and-run.bat junit-only chrome true   # JUnit only
docker-scripts\build-and-run.bat bdd-only firefox true    # BDD only
docker-scripts\build-and-run.bat all chrome true          # Both test types
```

### Advanced Configuration
The framework automatically handles:
- **Docker Chrome/Firefox** - Container-specific browser arguments and session management
- **Headless Display** - Xvfb server setup for GUI testing in Docker containers
- **Report Generation** - Automatic Allure and Cucumber report creation
- **Multi-format Output** - JUnit XML, Allure JSON, Cucumber JSON reports
- **Screenshot Management** - Failure screenshots with unique timestamps

### BDD Tag-Based Execution
```bash
# Priority-based tags
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@Smoke"        # Critical smoke tests
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@regression"   # High-priority regression

# Feature-based tags
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@HomePage"     # Home page scenarios
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@Cart"        # Shopping cart scenarios
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@Contact"     # Contact form scenarios

# Combined tags (AND/OR operations)
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@Cart and @Smoke"      # Cart smoke tests
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@HomePage or @Cart"    # HomePage OR Cart tests
```