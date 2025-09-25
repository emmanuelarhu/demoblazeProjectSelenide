# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Java-based test automation project using Selenide for end-to-end testing of the DemoBlaze e-commerce website (https://www.demoblaze.com). The project uses Maven for build management and JUnit 5 for test execution, with Allure for test reporting.

## Architecture

The project follows a comprehensive Page Object Model pattern with proper separation of concerns:

### Traditional Test Architecture
- **Page Classes**: Located in `src/main/java/pages/` - Complete page object implementations using Selenide
  - `HomePage` - Main page interactions and navigation
  - `CartPage` - Shopping cart functionality
  - `OrderPlacementPage` - Checkout and order placement
  - `ContactModal` - Contact form interactions
  - `ProductDetailsPage` - Individual product page actions
- **Test Classes**: Located in `src/test/java/tests/` - Clean test implementations using page objects
- **Base Test**: Located in `src/test/java/base/BaseTest.java` - Common test configuration with Selenide setup
- **Test Data**: Located in `src/main/java/data/TestData.java` - Centralized test data management
- **Test Utilities**: Located in `src/test/java/utils/` - Test listener for screenshots and utilities

### BDD Test Architecture
- **Feature Files**: Located in `src/test/resources/features/` - Gherkin scenarios in business language
  - `HomePage.feature` - Home page functionality scenarios
  - `Cart.feature` - Shopping cart scenarios
  - `Contact.feature` - Contact modal scenarios
- **Step Definitions**: Located in `src/test/java/stepDefinitions/` - Java implementation of Gherkin steps
  - `HomePageSteps.java` - Home page step implementations
  - `CartSteps.java` - Cart functionality steps
  - `ContactSteps.java` - Contact modal steps
- **Runners**: Located in `src/test/java/runners/` - Cucumber test execution configuration
- **Hooks**: Located in `src/test/java/hooks/` - Setup and teardown for BDD tests
- **Test Target**: All tests target the DemoBlaze demo e-commerce site for testing various e-commerce workflows

## Technology Stack

- **Java**: Version 21
- **Selenide**: Version 7.10.0 (Selenium WebDriver wrapper for concise UI testing)
- **JUnit 5**: Version 5.10.1 (Test framework for traditional tests)
- **Cucumber**: Version 7.14.1 (BDD framework with Gherkin syntax)
- **Allure**: Version 2.30.0 (Test reporting with allure-junit5, allure-selenide, and allure-cucumber7-jvm)
- **SLF4J + Logback**: Version 2.0.9 + 1.4.14 (Logging framework)
- **Maven**: Build automation tool with Surefire plugin for test execution and Cucumber reporting plugin

## Common Commands

### Build and Compilation
```bash
# Compile the project
mvn compile

# Compile tests
mvn test-compile

# Clean and compile
mvn clean compile
```

### Running Tests

#### Traditional JUnit Tests
```bash
# Run all JUnit tests
mvn test

# Run specific test class (note: tests are in tests package)
mvn test -Dtest=tests.HomePageTest

# Run specific test method
mvn test -Dtest=tests.HomePageTest#testHomePageBasicElements

# Run tests with browser configuration (configured in BaseTest.java)
mvn test -Dselenide.browser=chrome
mvn test -Dselenide.browser=firefox
mvn test -Dselenide.headless=true
mvn test -Dselenide.browserSize=1920x1080

# Run with multiple system properties
mvn test -Dselenide.browser=firefox -Dselenide.headless=true
```

#### BDD Cucumber Tests
```bash
# Run all BDD tests using Cucumber
mvn test -Dtest=runners.TestRunner

# Run BDD tests with specific tags
mvn test -Dtest=runners.TestRunner -Dcucumber.filter.tags="@Smoke"
mvn test -Dtest=runners.TestRunner -Dcucumber.filter.tags="@regression"
mvn test -Dtest=runners.TestRunner -Dcucumber.filter.tags="@HomePage"

# Run BDD tests with browser configuration
mvn test -Dtest=runners.TestRunner -Dselenide.browser=firefox

# Run specific feature
mvn test -Dtest=runners.TestRunner -Dcucumber.features=src/test/resources/features/HomePage.feature
```

### Build Management
```bash
# Clean project
mvn clean

# Package project
mvn package

# Install to local repository
mvn install
```

### Allure Reports
```bash
# Generate Allure report (works for both JUnit and BDD tests)
mvn allure:report

# Serve Allure report (opens browser with interactive report)
mvn allure:serve
```

### BDD Cucumber Reports
```bash
# Generate Cucumber HTML reports (after running BDD tests)
mvn verify

# View Cucumber reports
# Reports are generated in: target/cucumber-reports/
# Open target/cucumber-reports/overview-features.html in browser
```

### Docker Execution
```bash
# Build and run tests in Docker (Linux/Mac)
./docker-scripts/build-and-run.sh

# Build and run tests in Docker (Windows)
docker-scripts\build-and-run.bat

# Manual Docker execution
docker build -t demoblaze-tests .
docker run --rm -v "$(pwd)/target:/app/target" demoblaze-tests
```

## Test Configuration

### BaseTest Configuration
All tests extend `BaseTest` class which provides:
- Selenide configuration (browser, size, headless mode)
- Allure integration with screenshot capture
- Automatic cleanup after each test
- Screenshot folder configuration (`target/screenshots`)

### Browser Configuration
Selenide configuration is handled in `BaseTest.java` and can be overridden via system properties:

```bash
# Common Selenide system properties
-Dselenide.browser=chrome          # Browser selection (chrome/firefox)
-Dselenide.headless=true          # Headless mode
-Dselenide.browserSize=1920x1080  # Browser window size
-Dselenide.timeout=10000          # Element timeout in milliseconds
```

## Test Structure

The project uses clean separation with the following patterns:

- **Page Objects**: Use Selenide's `$()` and `$$()` syntax for element location
- **Base Test Class**: All tests extend `BaseTest` for common configuration
- **Test Listener**: `TestListener` class handles screenshot capture on failures
- **Fluent API**: Page methods return page objects for method chaining
- **Test Data**: Centralized in `TestData` class with nested static classes for organization
- **Assertions**: Use Selenide's built-in conditions like `shouldBe(visible)`, `shouldHave(text())`
- **Alert Handling**: Custom `handleAlert()` methods for JavaScript alert management

## Key Features Being Tested

1. **Home Page**: Navigation elements, product categories, product listings, and UI components
2. **Cart Functionality**: Adding products, cart management, item deletion
3. **Contact Modal**: Contact form interactions with validation testing
4. **Order Placement**: Complete e-commerce checkout flow with form validation
5. **Product Details**: Individual product page interactions

## Selenide Advantages

- **Implicit Waits**: Built-in waiting for elements to appear/disappear
- **Concise Syntax**: `$(selector).click()` instead of verbose WebDriver code
- **Automatic Screenshots**: Screenshots on test failures for debugging
- **Fluent Assertions**: Readable test conditions like `shouldBe(visible)`

## Logging

The project uses SLF4J with Logback for comprehensive logging configured via `src/test/resources/logback-test.xml`:

### Log Files
- **Test Execution**: `target/logs/test-execution.log` - All test execution logs with rolling policy
- **Page Actions**: `target/logs/page-actions.log` - Page object action logs with rolling policy
- **Console Output**: Real-time logging during test execution

### Log Configuration
- **Rolling Policy**: Time-based with size limits (10MB per file, max 30 days, 100MB total)
- **Package-Specific Loggers**: Separate loggers for `pages.*` and `tests.*` packages
- **Selenide Logging**: Configured at INFO level for WebDriver actions

### Log Levels
- **INFO**: Test start/end, major actions, verification results
- **DEBUG**: Detailed element interactions, alert handling
- **ERROR**: Test failures and exceptions

## CI/CD Integration

### Docker Support
- **Containerized Execution**: Uses `Dockerfile` with Java 21 and Chrome setup
- **Cross-Platform Scripts**: `docker-scripts/build-and-run.sh` (Linux/Mac) and `build-and-run.bat` (Windows)
- **Volume Mounting**: Test results, logs, and screenshots preserved in `target/` directory

### Jenkins Pipeline
- **Comprehensive CI/CD**: Complete Jenkins setup with `jenkins/jenkins-setup.md` guide
- **Parameterized Builds**: Test suite, browser, and headless mode selection
- **Automated Reporting**: Allure reports, Slack notifications, email alerts
- **JIRA Integration**: Automatic ticket creation for test failures
- **Artifact Management**: Screenshots, logs, and reports archived

## Development Notes

- **Maven Surefire Configuration**: Includes AspectJ weaver for Allure reporting
- **Test Base Class**: All tests must extend `BaseTest` for proper Selenide configuration
- **Screenshot Capture**: Automatic screenshots on test failures via `TestListener`
- **Page Objects**: Use method chaining for fluent test writing with comprehensive logging
- **Test Data**: Externalized to `TestData` class for maintainability
- **Alert Handling**: Abstracted into helper methods with proper logging
- **Browser Support**: Chrome and Firefox with configurable headless mode
- **Allure Integration**: Both allure-junit5 and allure-selenide for comprehensive reporting