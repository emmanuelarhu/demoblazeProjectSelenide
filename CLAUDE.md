# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Java-based test automation project using Selenide for end-to-end testing of the DemoBlaze e-commerce website (https://www.demoblaze.com). The project uses Maven for build management and JUnit 5 for test execution, with Allure for test reporting.

## Architecture

The project follows a comprehensive Page Object Model pattern with proper separation of concerns and package structure:

- **Page Classes**: Located in `src/main/java/pages/` - Complete page object implementations using Selenide
  - `HomePage` - Main page interactions and navigation
  - `CartPage` - Shopping cart functionality
  - `OrderPlacementPage` - Checkout and order placement
  - `ContactModal` - Contact form interactions
  - `ProductDetailsPage` - Individual product page actions
- **Test Classes**: Located in `src/test/java/tests/` - Clean test implementations using page objects
- **Test Data**: Located in `src/test/java/data/` - Centralized test data management
- **Test Resources**: Located in `src/test/resources/` - Logging configuration and test resources
- **Test Target**: All tests target the DemoBlaze demo e-commerce site for testing various e-commerce workflows

## Technology Stack

- **Java**: Version 21
- **Selenide**: Version 7.10.0 (Selenium WebDriver wrapper for concise UI testing)
- **JUnit 5**: Version 5.10.1 (Test framework)
- **Allure**: Version 2.30.0 (Test reporting with allure-junit5)
- **SLF4J + Logback**: Version 2.0.9 + 1.4.14 (Logging framework)
- **Maven**: Build automation tool

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
```bash
# Run all tests
mvn test

# Run specific test class (note: tests are in tests package)
mvn test -Dtest=tests.HomePageTest

# Run specific test method
mvn test -Dtest=tests.HomePageTest#testHomePageBasicElements

# Run tests with system properties (browser configuration)
mvn test -Dselenide.browser=chrome
mvn test -Dselenide.headless=true

# Run tests with logging level
mvn test -Dlogback.configurationFile=src/test/resources/logback-test.xml
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
# Generate Allure report
mvn allure:report

# Serve Allure report (if allure:serve goal is configured)
mvn allure:serve
```

## Selenide Configuration

Selenide can be configured through system properties or programmatically:

```bash
# Common Selenide system properties
-Dselenide.browser=chrome          # Browser selection
-Dselenide.headless=true          # Headless mode
-Dselenide.timeout=10000          # Element timeout in milliseconds
-Dselenide.baseUrl=https://www.demoblaze.com
```

## Test Structure

The project uses clean separation with the following patterns:

- **Page Objects**: Use Selenide's `$()` and `$$()` syntax for element location
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

The project uses SLF4J with Logback for comprehensive logging:

### Log Files
- **Test Execution**: `target/logs/test-execution.log` - All test execution logs
- **Page Actions**: `target/logs/page-actions.log` - Page object action logs
- **Console Output**: Real-time logging during test execution

### Log Levels
- **INFO**: Test start/end, major actions, verification results
- **DEBUG**: Detailed element interactions, alert handling
- **ERROR**: Test failures and exceptions

### Package-Specific Logging
- `pages.*` - Page object actions and verifications
- `tests.*` - Test execution flow and results
- `data.*` - Test data usage (if applicable)

## Development Notes

- **Proper Package Structure**: Pages in `pages.*`, tests in `tests.*`, data in `data.*`
- **Page Objects**: Use method chaining for fluent test writing with comprehensive logging
- **Test Data**: Externalized to `TestData` class for maintainability
- **Alert Handling**: Abstracted into helper methods with proper logging
- **Test Documentation**: Use descriptive `@DisplayName` annotations
- **Maven Structure**: Follows standard Maven directory structure
- **Selenide Integration**: Automatic WebDriver management
- **Logging Strategy**: Comprehensive logging for debugging and reporting